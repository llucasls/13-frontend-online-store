import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BiCartAlt } from 'react-icons/bi';

export default class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: { attributes: [] },
      evaluation: { comment: '' },
      countTotal: 0,
    };

    this.returnProductDetails = this.returnProductDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.returnProductDetails();
    this.onUpdateCount();
  }

  handleChange({ target }) {
    this.setState({
      evaluation: { comment: target.value },
    });
  }

  onUpdateCount() {
    const product = localStorage.getItem('product');
    const list = JSON.parse(product);

    this.setState({ countTotal: list.reduce((acc, { count }) => {
      acc += count;
      return acc;
    }, 0) });
  }

  addProduct({ target }) {
    const { products } = this.state;
    const quantity = products.available_quantity;

    const { evaluation: { comment }, products: { price, thumbnail, title } } = this.state;
    const { product } = localStorage;
    const list = JSON.parse(product);

    const item = {
      id: target.id,
      count: 1,
      evaluation: { comment },
      price,
      thumbnail,
      title,
      quantity };

    if (!list.find(({ id }) => id === item.id)) {
      localStorage.setItem('product', JSON.stringify([...list, item]));
    } else {
      localStorage.setItem('product', JSON.stringify(
        list.map((objct) => {
          if (objct.id === item.id) {
            objct.count += 1;
          }
          return objct;
        }),
      ));
    }
    this.onUpdateCount();
  }

  async returnProductDetails() {
    const { match: { params: { id } } } = this.props;
    const productsList = await localStorage.getItem('productsList');
    const listGet = JSON.parse(productsList);

    this.setState({
      products: listGet.filter((objct) => (objct.id === id))[0],
    });
  }

  render() {
    const {
      products: { id, title, thumbnail, price, attributes },
      evaluation: { comment }, countTotal } = this.state;

    return (
      <div>
        <Link data-testid="shopping-cart-button" to="/cart">
          <span>
            <BiCartAlt size={ 40 } />
          </span>
        </Link>
        <span data-testid="shopping-cart-size">
          { countTotal }
        </span>
        <h1 data-testid="product-detail-name">{title}</h1>
        <img src={ thumbnail } alt={ title } />
        <p>{price}</p>
        <ul>
          {attributes.map((attribute) => (
            <li key={ attribute.id }>
              {attribute.name}
              :
              {attribute.value_name}
            </li>
          ))}
        </ul>
        <button
          type="button"
          id={ id }
          data-testid="product-detail-add-to-cart"
          onClick={ this.addProduct }
        >
          Adicionar ao carrinho
        </button>
        <label htmlFor="evaluation ">
          Avaliação:
          <textarea
            id="evaluation"
            data-testid="product-detail-evaluation"
            value={ comment }
            onChange={ this.handleChange }
          />
        </label>
      </div>
    );
  }
}

ProductDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
