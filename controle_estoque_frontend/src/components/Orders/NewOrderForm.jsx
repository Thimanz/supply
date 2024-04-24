import { useEffect, useRef, useState } from "react";
import "./NewOrderForm.css";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductsModal from "../Products/ProductsModal";
import {
    getAllStocksList,
    getStocksListByProductId,
} from "../../services/stocksService";
import OrderItemStockDropdown from "./OrderItemStockDropdown";
import { postOrder } from "../../services/orderService";

const NewOrderForm = () => {
    const typeRef = useRef();
    const navigate = useNavigate();

    const orderTypes = {
        ENTRADA: "Entrada",
        SAIDA: "Saída",
        TRANSFERENCIA: "Transferência",
    };

    const [orderItems, setOrderItems] = useState([]);
    const [amounts, setAmounts] = useState([]);

    const [totalValue, setTotalValue] = useState(0);

    const [typeDropdownActive, setTypeDropdownActive] = useState(false);

    const [type, setType] = useState("");
    const [typeKey, setTypeKey] = useState("");
    const [stocksFrom, setStocksFrom] = useState([]);
    const [stocksTo, setStocksTo] = useState([]);

    const [supplierName, setSupplierName] = useState("");

    const [showProductModal, setShowProductModal] = useState(false);

    const [stocksListFrom, setStocksListFrom] = useState([]);
    const [stocksListTo, setStocksListTo] = useState([]);

    //carregar todos os estoques de retirada
    useEffect(() => {
        const fetchAllStocks = async () => {
            const stocksData = await getAllStocksList(navigate);
            setStocksListTo(stocksData.data);
        };
        fetchAllStocks();
    }, []);

    //atualizar quantidades e estoques de destino
    useEffect(() => {
        if (orderItems.length > 0) {
            setAmounts([...amounts, 1]);
            const fetchProductStocks = async () => {
                const stocksData = await getStocksListByProductId(
                    orderItems[orderItems.length - 1].id,
                    navigate
                );
                setStocksListFrom([...stocksListFrom, stocksData.data]);
            };
            fetchProductStocks();
        }
    }, [orderItems.length]);

    //atualizar preço total
    useEffect(() => {
        const totalItemValues =
            orderItems.length > 0 &&
            orderItems
                .map(
                    (item, index) =>
                        (typeKey === "ENTRADA"
                            ? item.precoCusto
                            : item.precoVenda) * amounts[index]
                )
                .filter((item) => item);

        const newTotalValue =
            totalItemValues.length > 0
                ? totalItemValues.reduce((sum, valor) => sum + valor)
                : 0;
        setTotalValue(newTotalValue);
    }, [JSON.stringify(orderItems), amounts, typeKey]);

    const [requestMsgs, setrequestMsgs] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const sendOrder = async () => {
        const response = await postOrder(
            {
                tipo: typeKey,
                nomeFornecedor: supplierName,
                itens: orderItems.map((item, index) => {
                    const itemObject = {
                        id: item.id,
                        quantidade: amounts[index],
                    };
                    if (typeKey !== "TRANSFERENCIA") {
                        typeKey === "ENTRADA"
                            ? Object.defineProperties(itemObject, {
                                  precoCusto: {
                                      value: item.precoCusto,
                                      writable: true,
                                      enumerable: true,
                                  },
                                  localDestino: {
                                      value: stocksTo[index],
                                      writable: true,
                                      enumerable: true,
                                  },
                              })
                            : Object.defineProperties(itemObject, {
                                  precoVenda: {
                                      value: item.precoVenda,
                                      writable: true,
                                      enumerable: true,
                                  },
                                  localRetirada: {
                                      value: stocksFrom[index],
                                      writable: true,
                                      enumerable: true,
                                  },
                              });
                    } else {
                        Object.defineProperties(itemObject, {
                            localDestino: {
                                value: stocksTo[index],
                                writable: true,
                                enumerable: true,
                            },
                            localRetirada: {
                                value: stocksFrom[index],
                                writable: true,
                                enumerable: true,
                            },
                        });
                    }
                    console.log(itemObject);
                    return itemObject;
                }),
            },
            navigate
        );
        console.log(response);
        if (response.status === 201) {
            setIsSuccess(true);
            setrequestMsgs(["Seu pedido foi registrado"]);
            setTimeout(() => navigate("/inicio"), 1000);
        } else {
            setIsSuccess(false);
            setrequestMsgs(response.erros.mensagens);
        }
    };

    return (
        <main className="main-order">
            <section className="centered-block">
                <div className="order-forms">
                    <section className="left-order-form">
                        <div className="input-group dropdown">
                            <div
                                onClick={(e) => {
                                    setTypeDropdownActive(!typeDropdownActive);
                                    typeRef.current.focus();
                                }}
                            >
                                <input
                                    ref={typeRef}
                                    type="button"
                                    value={type}
                                    required
                                    className="dropdown-btn"
                                />
                                <label htmlFor="type">Tipo de Transação</label>
                                {typeDropdownActive ? (
                                    <FaCaretUp className="arrow-icon" />
                                ) : (
                                    <FaCaretDown className="arrow-icon" />
                                )}
                            </div>
                            <div
                                className="dropdown-content"
                                style={{
                                    display: typeDropdownActive
                                        ? "block"
                                        : "none",
                                }}
                            >
                                {Object.keys(orderTypes).map((type) => {
                                    return (
                                        <div
                                            key={type}
                                            onClick={(e) => {
                                                setType(e.target.textContent);
                                                setTypeDropdownActive(
                                                    !typeDropdownActive
                                                );
                                                setTypeKey(type);
                                            }}
                                            className="item"
                                        >
                                            {orderTypes[type]}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                    <section className="right-order-form">
                        <div className="input-group">
                            <input
                                type="text"
                                onBlur={(e) => {
                                    setSupplierName(e.target.value);
                                }}
                                required
                                autoComplete="off"
                            />
                            <label htmlFor="nome">Nome do Fornecedor</label>
                        </div>
                    </section>
                </div>
                {orderItems.map((item, index) => (
                    <div className="order-items" key={index}>
                        <img
                            src={"\\" + item.imagem}
                            alt="imagem do produto"
                            className="product-image"
                        />
                        <div className="item-name-inputs">
                            <h4 className="product-name">{item.nome}</h4>
                            <div className="item-inputs">
                                {typeKey !== "" &&
                                    typeKey !== "TRANSFERENCIA" && (
                                        <div className="input-group item-input">
                                            <input
                                                type="number"
                                                pattern="[-+]?[0-9]*[.,]?[0-9]+"
                                                step="any"
                                                value={
                                                    typeKey === "ENTRADA"
                                                        ? item.precoCusto
                                                        : item.precoVenda
                                                }
                                                onChange={(e) => {
                                                    const newOrderItems = [
                                                        ...orderItems,
                                                    ];
                                                    typeKey === "ENTRADA"
                                                        ? (newOrderItems[
                                                              index
                                                          ].precoCusto =
                                                              parseFloat(
                                                                  e.target.value
                                                              ))
                                                        : (newOrderItems[
                                                              index
                                                          ].precoVenda =
                                                              parseFloat(
                                                                  e.target.value
                                                              ));
                                                    setOrderItems(
                                                        newOrderItems
                                                    );
                                                }}
                                                required
                                                autoComplete="off"
                                            />
                                            {typeKey === "ENTRADA" && (
                                                <label htmlFor="precoCusto">
                                                    Preço de custo
                                                </label>
                                            )}
                                            {typeKey === "SAIDA" && (
                                                <label htmlFor="precoVenda">
                                                    Preço de venda
                                                </label>
                                            )}
                                        </div>
                                    )}
                                <div className="product-input-group item-input">
                                    <input
                                        type="number"
                                        pattern="[-+]?[0-9]*[.,]?[0-9]+"
                                        step="any"
                                        value={String(amounts[index])}
                                        onChange={(e) => {
                                            const newAmounts = [...amounts];
                                            newAmounts[index] = parseInt(
                                                e.target.value
                                            );
                                            setAmounts(newAmounts);
                                        }}
                                        required
                                        autoComplete="off"
                                    />
                                    <label htmlFor="quantidade">
                                        Quantidade
                                    </label>
                                </div>
                                {typeKey !== "ENTRADA" && (
                                    <OrderItemStockDropdown
                                        stocksList={stocksListFrom[index]}
                                        selectedStocks={stocksFrom}
                                        setSelectedStocks={setStocksFrom}
                                        itemIndex={index}
                                        prompt={"Local de Retirada"}
                                    />
                                )}
                                {typeKey !== "SAIDA" && (
                                    <OrderItemStockDropdown
                                        stocksList={stocksListTo}
                                        selectedStocks={stocksTo}
                                        setSelectedStocks={setStocksTo}
                                        itemIndex={index}
                                        prompt={"Local de Destino"}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    className="new-product"
                    onClick={() => setShowProductModal(true)}
                >
                    <div className="sign">+</div>
                    <div className="text">Adicionar Item</div>
                </button>
                {typeKey === "ENTRADA" && (
                    <h2 className="total-price">
                        Custo total: R$
                        {totalValue}
                    </h2>
                )}
                {typeKey === "SAIDA" && (
                    <h2 className="total-price">
                        Valor total: R$
                        {totalValue}
                    </h2>
                )}
                {showProductModal && (
                    <ProductsModal
                        onClose={() => setShowProductModal(false)}
                        selectedProducts={orderItems}
                        setSelectedProducts={setOrderItems}
                    />
                )}
                <button className="confirm-order" onClick={sendOrder}>
                    Confirmar Pedido
                </button>
                {requestMsgs ? (
                    <h3 className={isSuccess ? "success-msg" : "error-msg"}>
                        {requestMsgs.map((msg) => (
                            <p>{msg}</p>
                        ))}
                    </h3>
                ) : null}
            </section>
        </main>
    );
};

export default NewOrderForm;
