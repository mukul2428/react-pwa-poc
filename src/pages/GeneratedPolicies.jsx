import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

const GeneratedPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/get-policies`
        );
        setPolicies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching policies:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Policy Holder Name</th>
              <th>Policy Type</th>
              <th>Coverage Amount</th>
              <th>Premium Amount</th>
              <th>Policy Duration</th>
            </tr>
          </thead>
          <tbody>
            {policies.length > 0 ? (
              policies?.map((item, i) => (
                <tr key={i}>
                  <td>{item.policyHolderName}</td>
                  <td>{item.policyType}</td>
                  <td>{item.coverageAmount}</td>
                  <td>{item.premiumAmount}</td>
                  <td>{item.premiumAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  <h6>No Records Available</h6>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GeneratedPolicies;
