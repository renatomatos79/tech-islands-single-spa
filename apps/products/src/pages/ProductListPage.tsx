import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import { useProductStore } from "../store/productStore";

const tableContainerStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 8,
  overflow: "hidden",
  boxShadow: "var(--shadow)",
  background: "var(--bg)"
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const headerCellStyle: CSSProperties = {
  padding: "12px 16px",
  borderRight: "1px solid var(--border)",
  borderBottom: "1px solid var(--border)",
  background: "var(--social-bg)",
  color: "var(--text-h)",
  fontSize: 14,
  fontWeight: 600
};

const cellStyle: CSSProperties = {
  padding: "12px 16px",
  borderRight: "1px solid var(--border)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle"
};

const zebraRowStyle: CSSProperties = {
  background: "var(--social-bg)"
};

const lastColumnStyle: CSSProperties = {
  borderRight: 0
};

const actionsCellStyle: CSSProperties = {
  ...cellStyle,
  whiteSpace: "nowrap"
};

const actionButtonStyle: CSSProperties = {
  cursor: "pointer"
};

export function ProductListPage() {
  const intl = useIntl();
  const { data, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const setSelectedProductId = useProductStore((s) => s.setSelectedProductId);

  if (isLoading) {
    return <p>{intl.formatMessage({ id: "products.loading" })}</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24
        }}
      >
        <h1>{intl.formatMessage({ id: "products.title" })}</h1>

        <Link to="/products/new">
          <button>+ {intl.formatMessage({ id: "products.add" })}</button>
        </Link>
      </div>

      {!data?.length ? (
        <p>{intl.formatMessage({ id: "products.empty" })}</p>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>
                  {intl.formatMessage({ id: "products.sku" })}
                </th>
                <th style={headerCellStyle}>
                  {intl.formatMessage({ id: "products.description" })}
                </th>
                <th style={headerCellStyle}>
                  {intl.formatMessage({ id: "products.price" })}
                </th>
                <th style={headerCellStyle}>
                  {intl.formatMessage({ id: "products.currency" })}
                </th>
                <th style={{ ...headerCellStyle, ...lastColumnStyle }}>
                  {intl.formatMessage({ id: "products.actions" })}
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((product, index) => {
                const rowCellStyle =
                  index === data.length - 1
                    ? { ...cellStyle, borderBottom: 0 }
                    : cellStyle;
                const rowActionsCellStyle =
                  index === data.length - 1
                    ? { ...actionsCellStyle, borderBottom: 0 }
                    : actionsCellStyle;

                return (
                  <tr
                    key={product.id}
                    style={index % 2 === 1 ? zebraRowStyle : undefined}
                  >
                    <td style={rowCellStyle}>{product.id}</td>
                    <td style={rowCellStyle}>{product.sku}</td>
                    <td style={rowCellStyle}>{product.description}</td>
                    <td style={rowCellStyle}>{product.price}</td>
                    <td style={rowCellStyle}>{product.currency}</td>
                    <td style={{ ...rowActionsCellStyle, ...lastColumnStyle }}>
                      <Link
                        to={`/products/${product.id}/edit`}
                        onClick={() => setSelectedProductId(product.id)}
                      >
                        <button style={actionButtonStyle}>
                          {intl.formatMessage({ id: "products.edit" })}
                        </button>
                      </Link>

                      <button
                        style={{ ...actionButtonStyle, marginLeft: 8 }}
                        onClick={() => deleteProduct.mutate(product.id)}
                      >
                        {intl.formatMessage({ id: "products.delete" })}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
