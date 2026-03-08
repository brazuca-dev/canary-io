#!/bin/bash

# Configurações de cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}=== Iniciando Geração de Chaves C2PA (Curva Elíptica ES256) ===${NC}"

# 1. Criar arquivo de configuração temporário para as extensões C2PA
cat <<EOF > c2pa_cert.conf
[req]
distinguished_name = req_distinguished_name
prompt = no

[req_distinguished_name]
C = BR
ST = SP
L = Sao Paulo
O = Desenvolvimento
CN = Certificado de Teste C2PA

[v3_req]
keyUsage = critical, digitalSignature, nonRepudiation
extendedKeyUsage = emailProtection, 1.3.6.1.4.1.311.10.3.12, codeSigning
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
EOF

echo -e "${GREEN}[1/5]${NC} Criando Autoridade Certificadora Raiz (Root CA)..."
# Gerar chave da Root CA
openssl genrsa -out root.key 2048 2>/dev/null
# Gerar certificado da Root CA (Válido por 10 anos para testes)
openssl req -x509 -new -nodes -key root.key -sha256 -days 3650 -out root.pem -subj "/C=BR/O=MinhaCA/CN=C2PA Root Dev"

echo -e "${GREEN}[2/5]${NC} Gerando Chave Privada do Ativo (EC prime256v1)..."
# Gerar chave privada usando Curva Elíptica (padrão es256)
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:prime256v1 -out private.key

echo -e "${GREEN}[3/5]${NC} Criando Pedido de Assinatura (CSR)..."
openssl req -new -key private.key -out private.csr -config c2pa_cert.conf

echo -e "${GREEN}[4/5]${NC} Assinando Certificado com a Root CA..."
openssl x509 -req -in private.csr -CA root.pem -CAkey root.key -CAcreateserial \
    -out certificate.pem -days 800 -sha256 -extfile c2pa_cert.conf -extensions v3_req 2>/dev/null

echo -e "${GREEN}[5/5]${NC} Criando arquivo de corrente (chain.pem)..."
# O C2PA exige a corrente completa: Certificado + Root CA
cat certificate.pem root.pem > chain.pem

# Limpeza de arquivos temporários
rm private.csr c2pa_cert.conf root.srl

echo -e "${BLUE}=== Processo Concluído com Sucesso! ===${NC}"
echo -e "Arquivos gerados:"
echo -e "  - ${GREEN}private.key${NC} (Use no seu manifest.json)"
echo -e "  - ${GREEN}chain.pem${NC}   (Use como 'sign_cert' no seu manifest.json)"
echo -e "  - ${GREEN}root.pem${NC}    (Importe no frontend como 'trustAnchor' se quiser status Válido)"