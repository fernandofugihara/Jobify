import { toast } from "react-toastify";
import custonFetch from "../utils/custonFetch";
import { redirect } from "react-router-dom";


export const action = async ({params}) => {
    try {
      await custonFetch.delete(`/jobs/${params.id}`);
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    };
    return redirect("/dashboard/all-jobs");
};