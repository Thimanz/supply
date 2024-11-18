﻿using FluentValidation.Results;
using GDE.Core.Messages;
using GDE.Core.Messages.Integration;
using GDE.Pedidos.API.Models;
using MassTransit;
using MediatR;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace GDE.Pedidos.API.Application.Commands
{
    public class PedidoTransferenciaCommandHandler : CommandHandler,
        IRequestHandler<AdicionarPedidoTransferenciaCommand, ValidationResult>
    {
        private readonly IPedidoTransferenciaRepository _pedidoTransferenciaRepository;
        private readonly IRequestClient<PedidoCadastradoIntegrationEvent> _requestClient;

        public PedidoTransferenciaCommandHandler(IPedidoTransferenciaRepository pedidoTransferenciaRepository, 
            IRequestClient<PedidoCadastradoIntegrationEvent> pedidoCadastradorequestClient)
        {
            _pedidoTransferenciaRepository = pedidoTransferenciaRepository;
            _requestClient = pedidoCadastradorequestClient;
        }

        public async Task<ValidationResult> Handle(AdicionarPedidoTransferenciaCommand message, CancellationToken cancellationToken)
        {
            if (!message.IsValid()) return message.ValidationResult;

            var pedidoTransferencia = MapearItens(message);

            _pedidoTransferenciaRepository.Adicionar(pedidoTransferencia);

            if (!message.ValidationResult.IsValid)
                return message.ValidationResult;

            var response = await TransferirItensEstoque(message);

            if (!response.ValidationResult.IsValid)
                return response.ValidationResult;

            return await PersistirDados(_pedidoTransferenciaRepository.UnitOfWork);
        }

        private async Task<ResponseMessage> TransferirItensEstoque(AdicionarPedidoTransferenciaCommand pedidoTransferencia)
        {
            var pedidoItemCadastrado = pedidoTransferencia.PedidoItens.ConvertAll(i => new PedidoItemIntegrationEvent
            (
                i.ProdutoId,
                i.LocalId,
                i.NomeProduto,
                i.Comprimento,
                i.Largura,
                i.Altura,
                i.Quantidade,
                i.PrecoUnitario,
                i.DataValidade,
                i.PedidoCompraId,
                i.PedidoVendaId,
                i.PedidoTransferenciaId)
            );

            var pedidoCadastrado = new PedidoCadastradoIntegrationEvent(TipoMovimentacao.Transferencia, pedidoItemCadastrado, pedidoTransferencia.IdLocalDestino);

            try
            {
                var response = await _requestClient.GetResponse<ResponseMessage>(pedidoCadastrado);

                return response.Message;
            }
            catch
            {
                throw;
            }
        }

        private PedidoTransferencia MapearItens(AdicionarPedidoTransferenciaCommand message)
        {
            var itens = message.PedidoItens
                .ConvertAll(i => new PedidoItem(
                    i.ProdutoId,
                    i.LocalId,
                    i.LocalNome,
                    i.Quantidade,
                    i.PrecoUnitario,
                    null,
                    null,
                    i.PedidoTransferenciaId,
                    i.DataValidade));

            return new PedidoTransferencia(message.IdLocalDestino!.Value, message.NomeLocalDestino, message.Timestamp, message.IdFuncionarioResponsavel, itens);
        }
    }
}
