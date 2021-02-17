import numeral  from 'numeral'
import React from 'react'
import './Table.css'


function Table({countries}) {
  return (
    <div className="table">
      {/* You can use destructuring as used here or regular mapping used in App.js */}
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td><strong>{numeral(cases).format('0,0')}</strong></td>
        </tr>
      ))}
    </div>
  )
}

export default Table
