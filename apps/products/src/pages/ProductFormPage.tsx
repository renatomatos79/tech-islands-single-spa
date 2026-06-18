import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import type {
  Currency,
  Product
} from "../api/productsApi";

import {
  useCreateProduct,
  useProduct,
  useUpdateProduct
} from "../hooks/useProducts";

type ProductFormData = {
  sku: string;
  description: string;
  price: number;
  currency: Currency;
};

export function ProductFormPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const { data: product } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const schema = yup.object({
    sku: yup.string().required(intl.formatMessage({ id: "validation.required" })),
    description: yup.string().required(intl.formatMessage({ id: "validation.required" })),
    price: yup
      .number()
      .typeError(intl.formatMessage({ id: "validation.required" }))
      .positive(intl.formatMessage({ id: "validation.price" }))
      .required(intl.formatMessage({ id: "validation.required" })),
    currency: yup
      .mixed<Currency>()
      .oneOf(["EUR", "USD", "BRL"])
      .required(intl.formatMessage({ id: "validation.required" }))
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      sku: "",
      description: "",
      price: 0,
      currency: "EUR"
    }
  });

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        description: product.description,
        price: product.price,
        currency: product.currency
      });
    }
  }, [product, reset]);

  function onSubmit(data: ProductFormData) {
    if (isEdit && id) {
      const updatedProduct: Product = {
        id,
        ...data
      };

      updateProduct.mutate(updatedProduct, {
        onSuccess: () => navigate("/products")
      });

      return;
    }

    createProduct.mutate(data, {
      onSuccess: () => navigate("/products")
    });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>
        {isEdit
          ? intl.formatMessage({ id: "products.edit" })
          : intl.formatMessage({ id: "products.add" })}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
        <div>
          <label>{intl.formatMessage({ id: "products.sku" })}</label>
          <input {...register("sku")} />
          <p>{errors.sku?.message}</p>
        </div>

        <div>
          <label>{intl.formatMessage({ id: "products.description" })}</label>
          <input {...register("description")} />
          <p>{errors.description?.message}</p>
        </div>

        <div>
          <label>{intl.formatMessage({ id: "products.price" })}</label>
          <input type="number" step="0.01" {...register("price")} />
          <p>{errors.price?.message}</p>
        </div>

        <div>
          <label>{intl.formatMessage({ id: "products.currency" })}</label>
          <select {...register("currency")}>
            <option value="EUR">{intl.formatMessage({ id: "currency.eur" })}</option>
            <option value="USD">{intl.formatMessage({ id: "currency.usd" })}</option>
            <option value="BRL">{intl.formatMessage({ id: "currency.brl" })}</option>
          </select>
          <p>{errors.currency?.message}</p>
        </div>

        <button type="submit">
          {intl.formatMessage({ id: "products.save" })}
        </button>

        <button type="button" onClick={() => navigate("/products")}>
          {intl.formatMessage({ id: "products.cancel" })}
        </button>
      </form>
    </main>
  );
}