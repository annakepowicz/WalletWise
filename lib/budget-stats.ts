type TransactionLike = {
  categoryId: string | null;
  type: string;
  date: Date;
  amount: unknown;
};

type CategoryLike = {
  id: string;
  name: string;
  monthlyLimit: unknown;
  isRolloverEnabled: boolean;
};

function getMonthBounds(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function buildCategoryBudgetStats(
  categories: CategoryLike[],
  transactions: TransactionLike[]
) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthBounds(
    year,
    month
  );
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const { start: lastMonthStart, end: lastMonthEnd } = getMonthBounds(
    prevYear,
    prevMonth
  );

  return categories.map((cat) => {
    const catTxs = transactions.filter((t) => t.categoryId === cat.id);

    const spentThisMonth = catTxs
      .filter(
        (t) =>
          t.type === "EXPENSE" &&
          t.date >= thisMonthStart &&
          t.date <= thisMonthEnd
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    let rolloverAmount = 0;
    if (cat.isRolloverEnabled) {
      const spentLastMonth = catTxs
        .filter(
          (t) =>
            t.type === "EXPENSE" &&
            t.date >= lastMonthStart &&
            t.date <= lastMonthEnd
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);
      rolloverAmount = Math.max(0, Number(cat.monthlyLimit) - spentLastMonth);
    }

    return {
      id: cat.id,
      name: cat.name,
      monthlyLimit: Number(cat.monthlyLimit),
      spentThisMonth,
      isRolloverEnabled: cat.isRolloverEnabled,
      rolloverAmount,
    };
  });
}
