import { ChartsContainer, StatsContainer } from "../components"
import custonFetch from "../utils/custonFetch"
import { useLoaderData } from "react-router-dom"

export const loader = async () => {
  try {
    const response = await custonFetch.get("jobs/stats");
    return response.data
  } catch (error) {
    
  }
};

const Stats = () => {

  const {defaultStats, monthlyApplications} = useLoaderData()

  return (
    <>
      <StatsContainer defaultStats={defaultStats}/>
      {
        monthlyApplications?.length > 1 && (
          <ChartsContainer data={monthlyApplications}/>
        )
      }
    </>
  )
}

export default Stats