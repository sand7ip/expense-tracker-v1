'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { async } from "@firebase/util";


export default function Home() {
  
  const  [expense, setExpense]= useState([
  //  {name:'Outside Food', price:'200'},
  //  {name:'Utility',price:'1000'},
  //  {name:'Transportation',price:'229'},
  ]);
  const [newExpense,setNewExpense]=useState({name:'',price:'',date:'',userid:''});
  const [totalExpense, setTotalExpense]=useState(0);
  
  //Add expense to database
  const addExpense= async(e) =>{
    e.preventDefault()
    if (newExpense.name!='' && newExpense.price!='' && newExpense.date!=''){
      //setItems([...items,newItem]);
      await addDoc(collection(db,'expense'),{
        date:newExpense.date,
        name:newExpense.name.trim(),
        price:newExpense.price,
        user_id: uuidv4(),

      });
      setNewExpense({date:'',name:'',price:'',userid:''})

    }
  }

  
  // Read expense from database

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

  // Delete Expense from database
  const deleteExpense = async(id)=>{
    await deleteDoc(doc(db,'expense',id));
  };

  const  [income, setIncome]= useState([
    //  { price:'200', date:'2022-10-10'},
    
    ]);
    const [newIncome,setNewIncome]=useState({price:'',date:'',userid:''});
    const [totalIncome, setTotalIncome]=useState(0);
 
  // Add income to database
  const addIncome = async (e) => {
    e.preventDefault();
    if ( newIncome.price !== '' && newIncome.date !== '') {
      await addDoc(collection(db, 'income'), {
        date: newIncome.date,
        income: newIncome.price,
        user_id: uuidv4(),
      });
      setNewIncome({ date: '', price: '',userid:''});
    }
  };

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

  // Delete income from database
  const deleteIncome = async (id) => {
    await deleteDoc(doc(db, 'income', id));
  };



  return (
    <main className="flex min-h-screen flex-col items-center sm:p-4 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono">
        <h1 className="text-2xl p-4 text-center justify"> Add Income</h1>
        <div className="bg-slate-300 p-4 rounded-lg">
        <form className="grid grid-cols-6 items-center text-black">
          
          <input
            className="col-span-1 p-2 border mx-3"
            type="date"
            value={income.date}
            onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
            max={new Date().toISOString().split('T')[0]} // Ensures the max date is today
          />
          <input
            className="col-span-2 p-2 border mx-3"
            type="number"
            placeholder="Enter Income"
            value={newIncome.price}
            onChange={(e) => setNewIncome({ ...newIncome, price: e.target.value })}
          />
          <button
            onClick={addIncome}
            className="col-span-1 bg-slate-600 text-white hover:bg-slate-950 p-3 text-l"
            type="submit"
          >
            Add
          </button>
          </form>
          {expense.length < 1 ? (''):(
            <div className="p-2 flex justify-between font-bold">
              <span> Total Income for Current Month</span>
              <span> Rs:{parseFloat(totalIncome)}</span>
            </div>
          )
          }
        </div>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl p-4 text-center"> Add Expense</h1>
        <div className="bg-slate-300 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black justify">
            
            <input
              className="col-span-1 p-3 border" 
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense,date:e.target.value})}
              max={new Date().toISOString().split('T')[0]} // Ensures the max date is today
            />
            
           
            <select 
              value={newExpense.name} 
              className="col-span-2 p-3 border mx-3" 
              onChange={(e) => setNewExpense({...newExpense,name:e.target.value})}>
                    {}
                    
                    <option value="Select">Select</option>
                    <option value="Transport">Transport</option>
                    <option value="House-Utilities">House Utilities</option>
                    <option value="Gift">Gift</option>
                    <option value="Outside Food">Outside Food</option>
                    <option value="Health">Health</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Investment">Investment</option>
                    <option value="Savings">Savings</option>
                    <option value="Savings">Grocery</option>
                    <option value="Others">Others</option>
                    {}
            </select>
            <input 
              value={newExpense.price}
              onChange={(e) => setNewExpense({...newExpense,price:e.target.value})}
              className="col-span-2 p-3 border mx-3" 
              type="number" 
              placeholder="Enter Expense"/>
            <button 
              onClick={addExpense}
              className="bg-slate-600 text-white hover:bg-slate-950 p-3 text-l"
              type="submit">
                Add
            </button>
          </form>
          {expense.length < 1 ? (''):(
            <div className="p-2 flex justify-between font-bold">
              <span> Total Expense for Current Month</span>
              <span> Rs:{totalExpense}</span>
            </div>
          )
          }
          <ul>
            {expense.map((expense,id) =>(
              <li key={id} className="my-4 w-full flex justify-between bg-slate-400">
                <div className="p-2 w-full flex justify-between">
                  <span>{expense.date}</span>
                  <span className="capitalize">{expense.name}</span>
                  <span>Rs:{expense.price}</span>
                </div>
                <button 
                  onClick={()=> deleteExpense(expense.id)}
                  className="ml-4 p-4  bg-slate-550 hover:bg-slate-500 w-16">
                    X
                </button>
              </li>
            ))}
          </ul>
          
        </div>
      </div>
      
    </main> 
    
  )
}
