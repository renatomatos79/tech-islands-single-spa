import { useEffect, useRef, type CSSProperties } from "react";
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

const toolbarStyle: CSSProperties = {
  display: "flex",
  gap: 8
};

const checkboxCellStyle: CSSProperties = {
  ...cellStyle,
  width: 48,
  textAlign: "center"
};

const checkboxHeaderCellStyle: CSSProperties = {
  ...headerCellStyle,
  width: 48,
  textAlign: "center"
};

export function ProductListPage() {
  const intl = useIntl();
  const { data, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const selectAllRef = useRef<HTMLInputElement>(null);
  const productIds = useProductStore((state) => state.productIds);
  const addProductId = useProductStore((state) => state.addProductId);
  const removeProductId = useProductStore((state) => state.removeProductId);
  const clearProductIds = useProductStore((state) => state.clearProductIds);
  const products = data ?? [];
  const hasSelectedProducts = productIds.length > 0;
  const allProductsSelected =
    products.length > 0 && products.every((product) => productIds.includes(product.id));
  const someProductsSelected =
    products.some((product) => productIds.includes(product.id)) && !allProductsSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someProductsSelected;
    }
  }, [someProductsSelected]);

  function handleSelectProduct(id: string, checked: boolean) {
    if (checked) {
      addProductId(id);
      return;
    }

    removeProductId(id);
  }

  function handleSelectAll(checked: boolean) {
    products.forEach((product) => {
      if (checked) {
        addProductId(product.id);
        return;
      }

      removeProductId(product.id);
    });
  }

  function handleDeleteSelectedProducts() {
    productIds.forEach((id) => deleteProduct.mutate(id));
    clearProductIds();
  }

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

        <div style={toolbarStyle}>
          <button
            disabled={!hasSelectedProducts || deleteProduct.isPending}
            onClick={handleDeleteSelectedProducts}
          >
            {intl.formatMessage({ id: "products.removeSelected" })}
          </button>

          <Link to="/products/new">
            <button>+ {intl.formatMessage({ id: "products.add" })}</button>
          </Link>
        </div>
      </div>

      {!products.length ? (
        <p>{intl.formatMessage({ id: "products.empty" })}</p>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={checkboxHeaderCellStyle}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allProductsSelected}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                  />
                </th>
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
              {products.map((product, index) => {
                const rowCellStyle =
                  index === products.length - 1
                    ? { ...cellStyle, borderBottom: 0 }
                    : cellStyle;
                const rowCheckboxCellStyle =
                  index === products.length - 1
                    ? { ...checkboxCellStyle, borderBottom: 0 }
                    : checkboxCellStyle;
                const rowActionsCellStyle =
                  index === products.length - 1
                    ? { ...actionsCellStyle, borderBottom: 0 }
                    : actionsCellStyle;
                const isSelected = productIds.includes(product.id);

                return (
                  <tr
                    key={product.id}
                    style={index % 2 === 1 ? zebraRowStyle : undefined}
                  >
                    <td style={rowCheckboxCellStyle}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) =>
                          handleSelectProduct(product.id, event.target.checked)
                        }
                      />
                    </td>
                    <td style={rowCellStyle}>{product.id}</td>
                    <td style={rowCellStyle}>{product.sku}</td>
                    <td style={rowCellStyle}>{product.description}</td>
                    <td style={rowCellStyle}>{product.price}</td>
                    <td style={rowCellStyle}>{product.currency}</td>
                    <td style={{ ...rowActionsCellStyle, ...lastColumnStyle }}>
                      <Link
                        to={`/products/${product.id}/edit`}
                      >
                        <button style={actionButtonStyle}>
                          {intl.formatMessage({ id: "products.edit" })}
                        </button>
                      </Link>

                      <button
                        style={{ ...actionButtonStyle, marginLeft: 8 }}
                        onClick={() => {
                          deleteProduct.mutate(product.id);
                          removeProductId(product.id);
                        }}
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
