﻿using FluentValidation.Results;
using GDE.Core.Mediator;
using GDE.Core.Usuario;
using GDE.Pedidos.API.Application.Commands;
using GDE.Pedidos.API.Data.Repository;
using GDE.Pedidos.API.Models;
using MediatR;

namespace GDE.Pedidos.API.Configuration
{
    public static class DependencyInjectionConfig
    {
        public static IServiceCollection AddDependencyInjectionConfiguration(this IServiceCollection services)
        {
            services.AddScoped<IMediatorHandler, MediatorHandler>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IAspNetUser, AspNetUser>();

            services.AddScoped<IRequestHandler<AdicionarPedidoCompraCommand, ValidationResult>, PedidoCompraCommandHandler>();
            services.AddScoped<IRequestHandler<AdicionarPedidoVendaCommand, ValidationResult>, PedidoVendaCommandHandler>();
            services.AddScoped<IRequestHandler<AdicionarPedidoTransferenciaCommand, ValidationResult>, PedidoTransferenciaCommandHandler>();

            services.AddScoped<IPedidoCompraRepository, PedidoCompraRepository>();
            services.AddScoped<IPedidoVendaRepository, PedidoVendaRepository>();
            services.AddScoped<IPedidoTransferenciaRepository, PedidoTransferenciaRepository>();

            return services;
        }
    }
}
