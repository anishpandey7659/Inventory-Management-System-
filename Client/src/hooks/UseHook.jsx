import { useState, useEffect } from "react";

// Fetch function
export const useFetch = (apiFunc, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    let allResults = [];
    let page = 1;
    let keepGoing = true;

    while (keepGoing) {
      const response = await apiFunc({}, page); // page 1, 2, 3...
      const resData = response.data;

      // stop if unauthorized
      if (resData.detail) throw new Error(resData.detail);

      if (resData.results && resData.results.length > 0) {
        allResults.push(...resData.results);
      }

      if (!resData.next) {
        keepGoing = false;
      } else {
        page += 1; // go to next page
      }
    }

    setData(allResults);
  } catch (err) {
    setError(err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
};



//Post Function
export const usePost = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postData = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiFunc(data);
      setSuccess(true);
      return response;   // ✅ return response here
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;         // ✅ important: throw error to catch it outside
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, postData };
};

import { getCategories,getSuppliers } from "../services/ApiService";

export const useCategories = () => {
  return useFetch(getCategories);
};

export const useSuppilier =()=>{
  return useFetch(getSuppliers);
}


// import { getProducts } from "./Apiservice";

