-----

# 🐤 Canary.io | Content Authenticity POC

> **Status:** Prova de Conceito (POC) para implementação do padrão **C2PA** (Coalition for Content Provenance and Authenticity).

-----

## 🎯 Objetivo do Projeto

O **Canary.io** nasceu para explorar a integridade digital de ativos visuais. O foco principal é demonstrar o fluxo completo de "ingestão-assinatura-exibição":

1.  Recebimento de uma imagem original.
2.  Otimização (redução da imagem em 20%) e conversão da imagem original (formato .webp).
2.  Injeção de um **Manifesto C2PA** (metadados criptográficos).
3.  Armazenamento em nuvem.
4.  Validação e extração desses dados de proveniência no Frontend para o usuário final.

-----

## 📸 Demonstração

![Demonstração da prova-de-conceito: Em uma página é solicitado para escolher uma imagem, após escolher e enviá-lo... somos redirecionados para uma página de visualização em que podemos ver a imagem otimizada e ao lado o manisfesto injetado com a tecnologia content-auth, C2PA](/demo.gif)

*A interface permite o upload e exibe instantaneamente o manifesto injetado ao lado da imagem otimizada.*

-----

## 🛠️ Tecnologias & Ferramentas

  * **Backend:** Deno para a API principal e workers (otimização de imagem e content-auth).
  * **Frontend:** Interface em html puro para visualização e envio das imagens.
  * **Cloud Storage:** AWS S3 (simulado via **LocalStack**) para persistência de imagens assinadas.
  * **Segurança:** Implementação de corrente de confiança (Certs/Private Keys) para assinatura digital.
  * **Infraestrutura:** Docker e Docker Compose para orquestração de ambiente.

-----

## 🚀 Como Executar o Projeto

### Pré-requisitos

  * Docker & Docker Compose instalado.
  * Deno.js (v2.7.11+ recomendado).

### Passo a Passo

1.  **Configuração de Ambiente:**
    Crie o arquivo de variáveis baseado no exemplo:

    ```bash
    cp .env.example .env
    ```

    > 💡 **Nota Técnica:** No arquivo `.env`, certifique-se de que a variável `LOCALSTACK_CORS_ORIGIN` esteja no formato de array JSON: `'["http://localhost:3000", ...]'`.

2.  **Inicialização:**
    Suba os containers (isso iniciará todos os serviços):

    ```bash
    docker compose up -d
    ```

3.  **Acesse o Navegador:**
    Abra `http://localhost:[PORTA_CONFIGURADA]` para testar o fluxo de assinatura.

-----

## 🧠 Destaques de Desenvolvimento

  * **C2PA Standard:** Implementação prática de um padrão emergente da indústria para combate a desinformação e IA generativa.
  * **Arquitetura Cloud-Native:** Uso de buckets S3 com políticas de CORS customizadas via LocalStack.
  * **Otimização prévia:** Uso do Sharp para otimizar as imagens, mudando o formato e reduzindo-as em 20%.
  * **Cadeia de workers:** Workes em cadeia foram implementados para manipulação das imagens.

-----

## 👤 Autor

Criado e mantido por **Ítalo (brazuca-dev)**.

  * [GitHub](https://github.com/brazuca-dev)
  * [LinkedIn](https://www.linkedin.com/in/ítalovasconcelos)

-----

*Foto de exemplo por [@Đặng Thanh Tú](https://www.pexels.com/pt-br/@d-ng-thanh-tu-2922122/) via Pexels.*
