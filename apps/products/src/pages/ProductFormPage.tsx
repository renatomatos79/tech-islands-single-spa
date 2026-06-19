import { useEffect, type CSSProperties } from "react";
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

const formStyle: CSSProperties = {
  maxWidth: 720,
  display: "flex",
  flexDirection: "column",
  gap: 4
};

const fieldRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 16,
  alignItems: "flex-start"
};

const labelStyle: CSSProperties = {
  gridColumn: "span 3",
  paddingTop: 8,
  color: "var(--text-h)",
  fontWeight: 500,
  textAlign: "right"
};

const controlStyle: CSSProperties = {
  gridColumn: "span 9"
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px"
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  lineHeight: "1.5",
  resize: "none"
};

const errorStyle: CSSProperties = {
  marginTop: 2,
  color: "#b42318",
  fontSize: 13,
  lineHeight: "16px"
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  justifyContent: "flex-end"
};

export function ProductFormPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  // If id is present, we're editing an existing product. Otherwise, we're creating a new one.
  const isEdit = (id ?? "").trim() !== "";

  const { data: product } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const schema = yup.object({
    sku: yup
      .string()
      .min(5, intl.formatMessage({ id: "validation.sku.min" }))
      .max(20, intl.formatMessage({ id: "validation.sku.max" }))
      .required(intl.formatMessage({ id: "validation.required" })),
    description: yup
      .string()
      .max(255, intl.formatMessage({ id: "validation.description.max" }))
      .required(intl.formatMessage({ id: "validation.required" })),
    price: yup
      .number()
      .typeError(intl.formatMessage({ id: "validation.required" }))
      .min(0, intl.formatMessage({ id: "validation.price" }))
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

      <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
        <div style={fieldRowStyle}>
          <label style={labelStyle}>{intl.formatMessage({ id: "products.sku" })}</label>
          <div style={controlStyle}>
            <input style={inputStyle} {...register("sku")} readOnly={isEdit} />
            {errors.sku?.message ? <p style={errorStyle}>{errors.sku.message}</p> : null}
          </div>
        </div>

        <div style={fieldRowStyle}>
          <label style={labelStyle}>
            {intl.formatMessage({ id: "products.description" })}
          </label>
          <div style={controlStyle}>
            <textarea
              style={textareaStyle}
              rows={3}
              maxLength={255}
              {...register("description")}
            />
            {errors.description?.message ? (
              <p style={errorStyle}>{errors.description.message}</p>
            ) : null}
          </div>
        </div>

        <div style={fieldRowStyle}>
          <label style={labelStyle}>{intl.formatMessage({ id: "products.price" })}</label>
          <div style={controlStyle}>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              {...register("price")}
            />
            {errors.price?.message ? <p style={errorStyle}>{errors.price.message}</p> : null}
          </div>
        </div>

        <div style={fieldRowStyle}>
          <label style={labelStyle}>
            {intl.formatMessage({ id: "products.currency" })}
          </label>
          <div style={controlStyle}>
            <select style={inputStyle} {...register("currency")}>
              <option value="EUR">{intl.formatMessage({ id: "currency.eur" })}</option>
              <option value="USD">{intl.formatMessage({ id: "currency.usd" })}</option>
              <option value="BRL">{intl.formatMessage({ id: "currency.brl" })}</option>
            </select>
            {errors.currency?.message ? (
              <p style={errorStyle}>{errors.currency.message}</p>
            ) : null}
          </div>
        </div>

        <div style={actionsStyle}>
          <button type="submit">
            {intl.formatMessage({ id: "products.save" })}
          </button>

          <button type="button" onClick={() => navigate("/products")}>
            {intl.formatMessage({ id: "products.cancel" })}
          </button>
        </div>
      </form>
    </main>
  );
}
