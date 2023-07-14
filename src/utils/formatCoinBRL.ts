const formatCoinBRL = (coin: number) => {
    const current = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return current.format(coin);

}
export default formatCoinBRL
