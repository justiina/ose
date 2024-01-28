'use client'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div>
      <ul className='flex border-b-2 border-grey'>
        <li className='p-2 cursor-pointer'>
          <Link href="/">Login</Link>
        </li>
        <li className='p-2 cursor-pointer'>
          <Link href="/main/calendar">Calendar</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar