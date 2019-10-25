import React, { useEffect, useState } from 'react'
import { Crew, Job, Member } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import settingsService from "../../emulator/settingsService";
import CrewTable from './CrewTable'

// @ts-ignore
const getJobTitleByProportion = (crew, member: Member) => {

  const jobSplit = settingsService.getJobSplit()
  const currentjobSplit = {
    // @ts-ignore
    medic: crew.filter((i) => i.job === Job.medic).length,
    // @ts-ignore
    engineer: crew.filter((i) => i.job === Job.engineer).length,
    // @ts-ignore
    pilot: crew.filter((i) => i.job === Job.pilot).length
  }

  function getJobByProportion(a: object, b: object) {
    let c = {};
    Object.keys(a).forEach((i) => {
      // @ts-ignore
      c[i] = a[i] / b[i]
    })
    // @ts-ignore
    const jobTitle = Object.keys(c).find(key => c[key] === Object.values(c).sort()[0])
    if (!jobTitle) return
    return jobTitle
  }

  return getJobByProportion(currentjobSplit, jobSplit)
}

function CrewPage(props: {}) {
  const [crew, setCrew] = useState<Crew>([])

  useEffect(
    () => {
      crewService.getCrew().then(crew => setCrew(crew))
    },
    []
  )

  useEffect(
    () => {
      const unsub = crewService.onMemberAdded(
        (member) => {
          const jobTitle = getJobTitleByProportion(crew, member);
          // @ts-ignore
          jobTitle && crewService.assignJob(member.id, Job[jobTitle]).then(() => {
            // @ts-ignore

            console.log(member);
            // @ts-ignore

            return setCrew([...crew, member]);
          })
        }
      )
      return unsub
    }, [crew]
  )

  useEffect(
    () => {
      const unsub = crewService.onMemberUpdated(
        (member) => {
          setCrew([...crew, member])
        }
      )
      return unsub
    },
    [crew]
  )

  return <div className='tableContainer'>
    <CrewTable crew={crew}/>
  </div>
}

export default CrewPage
