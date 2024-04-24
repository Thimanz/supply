﻿// <auto-generated />
using System;
using GDE.Estoque.Infra.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GDE.Estoque.Infra.Migrations
{
    [DbContext(typeof(EstoqueContext))]
    partial class EstoqueContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GDE.Estoque.Domain.Local", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.HasKey("Id");

                    b.ToTable("Locais");
                });

            modelBuilder.Entity("GDE.Estoque.Domain.LocalItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("LocalId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Nome")
                        .HasColumnType("varchar(100)");

                    b.Property<decimal>("Preco")
                        .HasColumnType("decimal(18,2)");

                    b.Property<Guid>("ProdutoId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Quantidade")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("LocalId");

                    b.ToTable("LocalItens");
                });

            modelBuilder.Entity("GDE.Estoque.Domain.Local", b =>
                {
                    b.OwnsOne("GDE.Estoque.Domain.Dimensoes", "Dimensoes", b1 =>
                        {
                            b1.Property<Guid>("LocalId")
                                .HasColumnType("uniqueidentifier");

                            b1.Property<decimal>("Altura")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Altura");

                            b1.Property<decimal>("Comprimento")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Comprimento");

                            b1.Property<decimal>("Largura")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Largura");

                            b1.HasKey("LocalId");

                            b1.ToTable("Locais");

                            b1.WithOwner()
                                .HasForeignKey("LocalId");
                        });

                    b.Navigation("Dimensoes")
                        .IsRequired();
                });

            modelBuilder.Entity("GDE.Estoque.Domain.LocalItem", b =>
                {
                    b.HasOne("GDE.Estoque.Domain.Local", "Local")
                        .WithMany("LocalItens")
                        .HasForeignKey("LocalId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("GDE.Estoque.Domain.Dimensoes", "Dimensoes", b1 =>
                        {
                            b1.Property<Guid>("LocalItemId")
                                .HasColumnType("uniqueidentifier");

                            b1.Property<decimal>("Altura")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Altura");

                            b1.Property<decimal>("Comprimento")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Comprimento");

                            b1.Property<decimal>("Largura")
                                .HasColumnType("decimal(18,2)")
                                .HasColumnName("Largura");

                            b1.HasKey("LocalItemId");

                            b1.ToTable("LocalItens");

                            b1.WithOwner()
                                .HasForeignKey("LocalItemId");
                        });

                    b.Navigation("Dimensoes")
                        .IsRequired();

                    b.Navigation("Local");
                });

            modelBuilder.Entity("GDE.Estoque.Domain.Local", b =>
                {
                    b.Navigation("LocalItens");
                });
#pragma warning restore 612, 618
        }
    }
}
