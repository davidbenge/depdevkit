/* 
* <license header>
*/

import React from 'react'
import { NavLink } from 'react-router-dom'

function SideBar () {
  return (
    <ul className="SideNav">
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" exact to="/">Home</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" to="/payload-test">Submit payload to webhook</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" to="/payload-list">List payload from webhooks</NavLink>
      </li>
    </ul>
  )
}

export default SideBar
