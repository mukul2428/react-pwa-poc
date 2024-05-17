import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

const GeneratedPolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/get-policies`);
        setPolicies(response.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
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
          {policies.map((item) => (
            <tr>
              <td>{item.policyHolderName}</td>
              <td>{item.policyType}</td>
              <td>{item.coverageAmount}</td>
              <td>{item.premiumAmount}</td>
              <td>{item.premiumAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GeneratedPolicies;
