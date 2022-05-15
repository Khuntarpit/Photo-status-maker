import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import { useDelete, useFetch, usePost } from "../API_Hooks";

const QuoteItem = () => {
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [subCategoryInfo, setSubCategoryInfo] = useState([]);
  const [quoteInfo, setQuoteInfo] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [quote, setQuote] = useState("");

  console.log(`categoryInfo`, categoryInfo);
  console.log(`subCategoryInfo`, subCategoryInfo);
  console.log(`quoteInfo`, quoteInfo);

  const { data: categoryData } = useFetch("/get-category");
  const { data: subCategoryData, status } = useFetch("/get-subcategory");
  const { data: quoteData } = useFetch("/get-quote");
  const { mutate } = usePost("/create-quote");
  const mutationDelete = useDelete("delete-quote/");

  useEffect(() => {
    setCategoryInfo(categoryData?.data);
    setSubCategoryInfo(subCategoryData?.data);
    setQuoteInfo(quoteData?.data);
  }, [categoryData?.data, subCategoryData?.data, quoteData && quoteData?.data]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setQuoteInfo([
      ...quoteInfo,
      { category_id: category, subcategory_id: subCategory, quote },
    ]);
    mutate({ category_id: category, subcategory_id: subCategory, quote });
    toast.success("Quote created successfully");
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const onDelete = async (id) => {
    await mutationDelete
      .mutateAsync(id)
      .then(() => {
        const filterData = quoteInfo.filter((ele) => ele._id !== id);
        setQuoteInfo(filterData);
        toast.success("Quote delete successfully");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  if (status === "loading") {
    return <div>...Loading</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <Form onSubmit={(e) => onSubmit(e)} className="mt-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Select Category</Form.Label>
          <Form.Select
            required
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Default select example"
          >
            <option>Select Category</option>
            {categoryInfo?.length > 0 &&
              categoryInfo?.map((item, i) => (
                <option key={i} value={item._id}>
                  {item.category}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Select SubCategory</Form.Label>
          <Form.Select
            required
            onChange={(e) => setSubCategory(e.target.value)}
            aria-label="Default select example"
          >
            <option>Select SubCategory</option>
            {subCategoryInfo?.length > 0 &&
              subCategoryInfo?.map((item, i) => (
                <option key={i} value={item._id}>
                  {item.subcategory}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Quote Name</Form.Label>
          <Form.Control
            onChange={(e) => setQuote(e.target.value)}
            name="quote"
            required
            type="text"
            placeholder="Enter quote name"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <div className="mt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {quoteInfo?.length > 0 &&
              quoteInfo?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.quote}</td>
                  <td>{item.category}</td>
                  <td>{item.subcategory}</td>
                  <td className="text-center">
                    <Button onClick={() => onDelete(item._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteItem;
