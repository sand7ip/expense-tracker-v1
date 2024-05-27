// pages/dashboard.js
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [expenseIncomeRatio, setExpenseIncomeRatio] = useState({});
  const [categorySplit, setCategorySplit] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const currentYear = new Date().getFullYear();
    const expensesRef = firestore.collection('expenses').where('user_id', '==', user.uid).where('date', '>=', `${currentYear}-01-01`).where('date', '<=', `${currentYear}-12-31`);
    const incomeRef = firestore.collection('income').where('user_id', '==', user.uid).where('date', '>=', `${currentYear}-01-01`).where('date', '<=', `${currentYear}-12-31`);
    const expensesSnapshot = await expensesRef.get();
    const incomeSnapshot = await incomeRef.get();

    const expensesData = expensesSnapshot.docs.map(doc => doc.data());
    const incomeData = incomeSnapshot.docs.map(doc => doc.data());

    const totalExpense = expensesData.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
    const totalIncome = incomeData.reduce((acc, inc) => acc + parseFloat(inc.amount), 0);

    setExpenseIncomeRatio({
      labels: ['Expenses', 'Income'],
      datasets: [{
        label: 'Year-to-Date',
        data: [totalExpense, totalIncome],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      }],
    });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = expensesData.filter(exp => exp.date.startsWith(currentMonth));
    const categoryTotals = monthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    setCategorySplit({
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: 'Current Month',
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
          'rgba(199, 199, 199, 0.2)', 'rgba(83, 102, 102, 0.2)',
          'rgba(0, 102, 204, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)', 'rgba(83, 102, 102, 1)',
          'rgba(0, 102, 204, 1)'
        ],
        borderWidth: 1,
      }],
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Year-to-Date Expense vs Income</h2>
        <Bar data={expenseIncomeRatio} />
      </div>
      <div>
        <h2 className="text-2xl mb-4">Current Month's Expense Split</h2>
        <Pie data={categorySplit} />
      </div>
    </div>
  );
}
