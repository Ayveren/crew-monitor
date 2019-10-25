import React from 'react'
import { Crew } from '../../emulator/types'

export default function CrewTable (props: { crew: Crew }) {
  const { crew } = props
  return <table>
    <tbody>
      {crew.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1).map(member => <tr key={member.id + Date.now()}>
        <td>{member.id}</td>
        <td>{member.lastName}, {member.firstName}</td>
        <td>
          <span className={member.job}>
            {member.job}
          </span>
        </td>
      </tr>)}
    </tbody>
  </table>
}
