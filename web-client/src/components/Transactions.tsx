import React, { useEffect } from 'react';
import { useTable, Column } from 'react-table';
import { useAppContext } from '../context/AppContext';

interface TableData {
  fromAccount: string;
  toAccount: string;
  type: string;
  amount: number;
  createdAt: string;
}

const Transactions = () => {

  const { fetchTransactions, transactions } = useAppContext();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions])

  console.log("transactions", transactions);
  

  const columns = React.useMemo<Column<TableData>[]>(
    () => [
      {
        Header: 'From Account',
        accessor: 'fromAccount',
      },
      {
        Header: 'To Account',
        accessor: 'toAccount',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
      },
    ],
    []
  )

  const data = React.useMemo(() => {
    return transactions.map((transaction) => {
      return {
        fromAccount: `${transaction.fromAccount.owner.firstName} ${transaction.fromAccount.owner.lastName}`,
        toAccount:  `${transaction.toAccount.owner.firstName} ${transaction.toAccount.owner.lastName}`,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: new Date(transaction.createdAt).toDateString(),
      }
    })
  }, [transactions])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <div className="h-fit max-w-lg bg-white border border-primary rounded-lg shadow-md">
      <div className="flex flex-col items-center px-5 py-2">
        <div className="flex flex-col p-2">
          <div className='w-full p-2'>
            <h2 className="text-xl text-left font-semibold text-gray capitalize">Transactions</h2>
          </div>
        </div>
        <div>
          <table
            {...getTableProps()}
            className="w-full mt-8 text-sm text-left text-gray overflow"
          >
            <thead className="text-xs text-gray uppercase ">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <th
                        {...column.getHeaderProps()}
                        className="py-3 px-6"
                      >
                        <div className="flex">
                          {column.render('Header')}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} className="py-4 px-4">
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions