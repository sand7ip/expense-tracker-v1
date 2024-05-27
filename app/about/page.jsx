
'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import { Bar, PieChart, BarChart} from 'react-chartjs-2';
import { db } from '../firebase';
import { async } from "@firebase/util";


const page =() => {
    const  [income, setIncome]= useState([
        //  { price:'200', date:'2022-10-10'},
        ]);
    const [newIncome,setNewIncome]=useState({price:'',date:'',userid:''});
    const [totalIncome, setTotalIncome]=useState(0);

    // Read income from database
  useEffect(()=>{
    const q= query(collection(db,'income'))
    const unsubscribe =onSnapshot(q,(querySnapshot)=> {
      let itemsArr=[]
      querySnapshot.forEach((doc)=>{
        itemsArr.push({...doc.data(),id:doc.id})
      });
      setIncome(itemsArr);

      // Calculate total for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const filteredIncome = itemsArr.filter(income => {
        const incomeMonth = new Date(income.date).getMonth();
        const incomeYear = new Date(income.date).getFullYear();
        return incomeMonth === currentMonth && incomeYear === currentYear;
      });
      
      
      const calculateCurrentMonthIncome=()=>{
        const totalIncome = filteredIncome.reduce((sum, filteredIncome) => sum + parseFloat(filteredIncome.income), 0);
        setTotalIncome(totalIncome)
      }
      calculateCurrentMonthIncome()
      return () => unsubscribe();

      
      
    });
   
  },[]
  )

  //expense
  const  [expense, setExpense]= useState([
    //  {name:'Outside Food', price:'200'},
    //  {name:'Utility',price:'1000'},
    //  {name:'Transportation',price:'229'},
    ]);
    const [newExpense,setNewExpense]=useState({name:'',price:'',date:'',userid:''});
    const [totalExpense, setTotalExpense]=useState(0);

  useEffect(()=>{
    const q= query(collection(db,'expense'))
    const unsubscribe =onSnapshot(q,(querySnapshot)=> {
      let itemsArr=[]
      querySnapshot.forEach((doc)=>{
        itemsArr.push({...doc.data(),id:doc.id})
      });
      setExpense(itemsArr);

      // Calculate total for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const filteredExpense = itemsArr.filter(expense => {
        const expenseMonth = new Date(expense.date).getMonth();
        const expenseYear = new Date(expense.date).getFullYear();
        return expenseMonth === currentMonth && expenseYear === currentYear;
      });
      
      
      const calculateCurrentMonthExpense=()=>{
        const totalExpense = filteredExpense.reduce((sum, filteredExpense) => sum + parseFloat(filteredExpense.price), 0);
        setTotalExpense(totalExpense)
      }
      calculateCurrentMonthExpense()
      return () => unsubscribe();

      
      
    });
   
  },[]
  )

  


    return (
        <div className="grid lg:grid-cols-4 gap-4 p-4">
            <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
                <div className="flex flex-col w-full pb-4">
                    <p className="text-2xl font-bold">Rs:{totalIncome}</p>
                    <p className="text-gray-600">
                        Income of: {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                    </p>
                </div>
            </div>
            <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
                <div className="flex flex-col w-full pb-4">
                    <p className="text-2xl font-bold">Rs: {totalExpense}</p>
                    <p className="text-gray-600">
                        Expense of: {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
              <p>This year Expense, Income split</p>
            </div>
            <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
              <p>This year Investment</p>
            </div>
            <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
              <p>Category wise split for current month </p>
              
            </div>
        </div>
    );
}

export default page;
