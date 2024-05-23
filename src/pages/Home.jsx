import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInsurance({ ...newInsurance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    await fetch(`${process.env.REACT_APP_URL}/create-policy`, {
      method: "POST",
      body: JSON.stringify(newInsurance),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          toast(data?.message);
          console.log(data);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
        toast("Request will be retried once the network is back.");
        setLoading(false);
      });
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default Home;
