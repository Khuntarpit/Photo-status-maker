import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import { useDelete, useFetch, usePost } from "../API_Hooks";

const CategoryItem = () => {
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [category, setCategory] = useState("");

  const { data, status } = useFetch("/get-category");

  useEffect(() => {
    setCategoryInfo(data?.data);
  }, [data?.data]);

  const { mutate } = usePost("/create-category");
  const mutationDelete = useDelete("delete-category/");

  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Category create successfully");
    setCategoryInfo([...categoryInfo, { category }]);
    mutate({ category });
  };

  const onDelete = async (id) => {
    await mutationDelete
      .mutateAsync(id)
      .then(() => {
        const filterData = categoryInfo.filter((ele) => ele._id !== id);
        setCategoryInfo(filterData);
        toast.success("Category delete successfully");
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
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            type="text"
            placeholder="Enter category name"
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
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryInfo?.length > 0 &&
              categoryInfo?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.category}</td>
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

export default CategoryItem;
