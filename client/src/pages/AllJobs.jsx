import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import custonFetch from '../utils/custonFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async ({request}) => {

  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const {data} = await custonFetch.get("/jobs", {params});
    return {data, searchValues:{...params}};
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const AllJobsContext = createContext();

const AllJobs = () => {

  const {data, searchValues} = useLoaderData();

  return (
    <AllJobsContext.Provider value={{data, searchValues}}>
      <SearchContainer/>
      <JobsContainer/>
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => (useContext(AllJobsContext));

export default AllJobs