import React, { useEffect, useState } from "react";

const Home = () => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [newInsurance, setNewInsurance] = useState({
    policyHolderName: "",
    policyType: "",
    coverageAmount: "",
    beneficiary: "",
    premiumAmount: "",
    policyDuration: "",
  });

  useEffect(() => {
    // Load data from cache when component mounts
    if ("caches" in window) {
      caches.open("insuranceData").then((cache) => {
        cache.match("insuranceData").then((response) => {
          if (response) {
            response.json().then((data) => {
              setInsuranceData(data);
            });
          }
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInsurance({ ...newInsurance, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedInsuranceData = [...insuranceData, newInsurance];
    setInsuranceData(updatedInsuranceData);
    setNewInsurance({
      policyHolderName: "",
      policyType: "",
      coverageAmount: "",
      beneficiary: "",
      premiumAmount: "",
      policyDuration: "",
    });

    // Update cache with new data
    if ("caches" in window) {
      caches.open("insuranceData").then((cache) => {
        cache.put(
          "insuranceData",
          new Response(JSON.stringify(updatedInsuranceData))
        );
      });
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "600px", margin: "0 auto", marginTop: "50px" }}
    >
      <h3 className="text-center mt-3">Insurance Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="policyHolderName" className="form-label">
            Policy Holder Name:
          </label>
          <input
            type="text"
            id="policyHolderName"
            name="policyHolderName"
            className="form-control"
            value={newInsurance.policyHolderName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="policyType" className="form-label">
            Policy Type:
          </label>
          <input
            type="text"
            id="policyType"
            name="policyType"
            className="form-control"
            value={newInsurance.policyType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="coverageAmount" className="form-label">
            Coverage Amount:
          </label>
          <input
            type="text"
            id="coverageAmount"
            name="coverageAmount"
            className="form-control"
            value={newInsurance.coverageAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="beneficiary" className="form-label">
            Beneficiary:
          </label>
          <input
            type="text"
            id="beneficiary"
            name="beneficiary"
            className="form-control"
            value={newInsurance.beneficiary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="premiumAmount" className="form-label">
            Premium Amount:
          </label>
          <input
            type="text"
            id="premiumAmount"
            name="premiumAmount"
            className="form-control"
            value={newInsurance.premiumAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="policyDuration" className="form-label">
            Policy Duration:
          </label>
          <input
            type="text"
            id="policyDuration"
            name="policyDuration"
            className="form-control"
            value={newInsurance.policyDuration}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {insuranceData.length > 0 && (
        <div className="submitted-data mt-4">
          <h3>Submitted Insurance Data:</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Policy Holder Name</th>
                <th>Policy Type</th>
                <th>Coverage Amount</th>
                <th>Beneficiary</th>
                <th>Premium Amount</th>
                <th>Policy Duration</th>
              </tr>
            </thead>
            <tbody>
              {insuranceData.map((insurance, index) => (
                <tr key={index}>
                  <td>{insurance.policyHolderName}</td>
                  <td>{insurance.policyType}</td>
                  <td>{insurance.coverageAmount}</td>
                  <td>{insurance.beneficiary}</td>
                  <td>{insurance.premiumAmount}</td>
                  <td>{insurance.policyDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
