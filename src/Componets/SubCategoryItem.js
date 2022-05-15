import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import { useDelete, useFetch, usePost } from "../API_Hooks";

const SubCategoryItem = () => {
  const [subCategoryInfo, setSubCategoryInfo] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data, status } = useFetch("/get-subcategory");
  const { data: categoryData } = useFetch("/get-category");
  const { mutate } = usePost("/create-subcategory");
  const mutationDelete = useDelete("delete-subcategory/");

  useEffect(() => {
    setSubCategoryInfo(data?.data);
  }, [data?.data]);

  useEffect(() => {
    setCategoryInfo(categoryData?.data);
  }, [categoryData?.data]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubCategoryInfo([
      ...subCategoryInfo,
      { category_id: category, subcategory: subCategory, imageUrl },
    ]);
    mutate({ category_id: category, subcategory: subCategory, imageUrl });
    toast.success("SubCategory create successfully");
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const onDelete = async (id) => {
    await mutationDelete
      .mutateAsync(id)
      .then(() => {
        const filterData = subCategoryInfo.filter((ele) => ele._id !== id);
        setSubCategoryInfo(filterData);
        toast.success("SubCategory delete successfully");
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
          <Form.Label>SubCategory Name</Form.Label>
          <Form.Control
            onChange={(e) => setSubCategory(e.target.value)}
            name="subcategory"
            required
            type="text"
            placeholder="Enter category name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Image Url</Form.Label>
          <Form.Control
            onChange={(e) => setImageUrl(e.target.value)}
            name="imageUrl"
            required
            type="text"
            placeholder="Enter image url"
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
              <th>Category Name</th>
              <th>Image</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {subCategoryInfo?.length > 0 &&
              subCategoryInfo?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.subcategory}</td>
                  <td>{item.category}</td>
                  <td>
                    <img
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                      src={item.imageUrl}
                      alt={item.imageUrl}
                    />
                  </td>
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

export default SubCategoryItem;
