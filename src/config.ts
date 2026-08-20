/**
 * Dados fixos da CONTRATADA, usados no contrato gerado.
 * Edite aqui e publique de novo (git commit + push) sempre que precisar
 * mudar algo — não existe painel de configurações nesta versão simples.
 */
import companyLogoDataUri from "./assets/logo-difestas.jpg?inline";

export const COMPANY_CONFIG = {
  name: "DI FESTAS E DECORAÇÕES",
  address: "Rua Antônio Bandeira, nº 87, Aquiraz/CE",
  representativeName: "",
  representativeCpf: "",
  /**
   * ?inline faz o Vite embutir a imagem como data URI no próprio JS, o
   * que é necessário porque o contrato é aberto como um Blob HTML isolado,
   * sem acesso confiável a caminhos relativos do site.
   */
  logoDataUri: companyLogoDataUri,
};
