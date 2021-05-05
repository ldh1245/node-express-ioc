function getLastPage(totalCount: number, pageSize: number): number {
    return totalCount < 1 ? 1 : Math.ceil(totalCount / pageSize);
}

export { getLastPage };
