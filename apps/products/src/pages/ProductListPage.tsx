import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import { useProductStore } from "../store/productStore";

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
        <table width="100%" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>{intl.formatMessage({ id: "products.sku" })}</th>
              <th>{intl.formatMessage({ id: "products.description" })}</th>
              <th>{intl.formatMessage({ id: "products.price" })}</th>
              <th>{intl.formatMessage({ id: "products.currency" })}</th>
              <th>{intl.formatMessage({ id: "products.actions" })}</th>
            </tr>
          </thead>

          <tbody>
            {data.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.sku}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.currency}</td>
                <td>
                  <Link
                    to={`/products/${product.id}/edit`}
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    <button>
                      {intl.formatMessage({ id: "products.edit" })}
                    </button>
                  </Link>

                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => deleteProduct.mutate(product.id)}
                  >
                    {intl.formatMessage({ id: "products.delete" })}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}