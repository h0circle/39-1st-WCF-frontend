import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Cart.scss';

const CartFilled = props => {
  const { checkList, setCheckList, cartData, setCartData } = props;

  const [checkArr, setCheckArr] = useState([]);
  const navigate = useNavigate();

  const valueArr = Object.values(checkList).every(el => el === true);

  const onCheckedAll = () => {
    let newObj = {};
    for (let key in checkList) {
      newObj = { ...newObj, [key]: !valueArr };
    }

    fetch(API, {
      method: 'PATCH',
      headers: {
        authorization: localStorage.getItem('TOKEN'),
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then(response => response.json())
      .then(data => {
        setCartList(data);
      }
      
    setCheckList(newObj);
  
  }

  const handleCheck = e => {
    const { name, checked, id } = e.target;
    setCheckList(prev => ({
      ...prev,
      [name]: checked,
    }));
    if (checkArr.includes(id)) {
      let newArr = checkArr.filter(el => el !== id);

      fetch(API, {
        method: 'PATCH',
        headers: {
          authorization: localStorage.getItem('TOKEN'),
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then(response => response.json())
        .then(data => {
          setCartList(data);

      setCheckArr(newArr);
    } else {

      fetch(API, {
        method: 'PATCH',
        headers: {
          authorization: localStorage.getItem('TOKEN'),
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then(response => response.json())
        .then(data => {
          setCartList(data);

      setCheckArr(prev => [...prev, id]);
    }
  };

  const deleteProduct = productId => {
    const filtered = cartData.filter(({ id }) => id !== productId);

    fetch('API', {
      method: 'DELETE',
      body: JSON.stringify({
        id: productId,
      }),
    }).then(res => {
      if (res.ok) {
        setCartData(filtered);
      } else {
        alert('다시 시도해주세요!');
      }
    });

    setCartData(filtered);
  };

  const cartHidden = cartData.length === 0 ? 'hidden' : '';

  // const deleteProduct = productId => {
  //   fetch('API', {
  //     method: 'DELETE',
  //     body: JSON.stringify({
  //       id: productId,
  //     }),
  //   }).then(res => {
  //     if (res.ok) {
  //       props.getCartList();
  //     } else {
  //       alert('다시 시도해주세요!');
  //     }
  //   });
  // };

  const checkedTitle = [];

  Object.entries(checkList).forEach(([title, value]) => {
    if (value) checkedTitle.push(title);
  });

  const totalPrice = cartData.reduce((acc, cur) => {
    if (checkedTitle.includes(cur.name)) {
      return acc + cur.price * cur.count;
    } else return acc;
  }, 0);

  // useEffect(() => {
  //   fetch('/data/CartData.json')
  //     .then(res => res.json())
  //     .then(data => {
  //       setCartData(data);
  //       setCheckList(
  //         data.reduce((acc, el) => ({ ...acc, [el.name]: false }), {})
  //       );
  //     });
  // }, []);

  return (
    <div className="container cartfilled">
      <div className={`cartfilled-top ${cartHidden}`}>
        <div className="top-left">
          <input
            id="checked-all"
            type="checkbox"
            className="check"
            onChange={onCheckedAll}
            checked={valueArr}
          />
          <label htmlFor="checked-all" className="check-all">
            전체선택
          </label>
        </div>
        <button className="delete-chosen-goods">선택 상품 삭제</button>
      </div>
      <div className="cart-data-box">
        {cartData.map(item => (
          <div className="cart-data" key={item.id}>
            <div className="header">
              <div className="goods-info">상품・혜택정보</div>
              <div className="shipping-info">배송정보</div>
              <div className="ordered-price">주문금액</div>
            </div>
            <div className="info">
              <div className="info-left">
                <input
                  type="checkbox"
                  id={item.id}
                  name={item.name}
                  className="check-goods"
                  value={item.price}
                  checked={checkList[item.name]}
                  onChange={handleCheck}
                />
                <label htmlFor={item.id} />
                <img src={item.src} alt="사진" />
                <div className="goods-infomation">
                  <p className="info-title">{item.brand}</p>
                  <p className="info-detail">{item.title}</p>
                  <p className="info-option">
                    {item.color ? `${item.color} /` : null} {item.size} /{' '}
                    {item.count}개
                  </p>
                  <button type="button" className="option-quantity-change">
                    옵션/수량 변경
                  </button>
                </div>
              </div>

              <div className="info-middle-right">
                <div className="info-middle">
                  <p className="free-delivery">무료배송</p>
                  <p className="release">내일 출고 예정</p>
                </div>

                <div className="info-right">
                  <p className="total-price">{item.price.toLocaleString()}원</p>
                  <button type="button" className="buy-now">
                    바로구매
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="delete-goods"
                onClick={() => deleteProduct(item.id)}
              >
                <span className="delete-goods-text">엑스</span>
              </button>
            </div>

            <div className="order-amount-box-wrap">
              <div className="order-amount-box">
                <div className="left-sub-box">
                  <p className="left-title">스토어 주문금액 합계</p>
                  <p className="left-sub-title">
                    상품금액 {(item.price * item.count).toLocaleString()}원 +
                    배송비 0원 − 할인금액 0원
                  </p>
                </div>
                <div className="right-sub-box">
                  <p className="price">
                    {(item.price * item.count).toLocaleString()}원
                  </p>
                  <p className="shipping">무료배송</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`bottom-order-amount-box ${cartHidden}`}>
        <div className="amount-header">결제 예정 금액 총 1건</div>
        <div className="total-amount">
          <div className="goods-amount-price">
            {/* <p className="amount-price">{cartData.price}원</p> */}
            <p className="amount-price">{totalPrice.toLocaleString()}원</p>
            <p className="price-text">상품금액</p>
          </div>
          <div className="amount-sign-plus">+</div>
          <div className="amount-delivery-box">
            <div className="amount-delivery">
              <p className="delivery-price">0원</p>
              <p className="delivery-text">배송비</p>
            </div>
          </div>
          <div className="amount-sign-minus">−</div>
          <div className="amount-discount-box">
            <div className="amount-discount">
              <p className="discount-price">0원</p>
              <p className="discount-text">할인금액</p>
            </div>
          </div>
          <div className="amount-sign-total">=</div>
          <div className="total-amounts-box">
            <div className="total-amounts">
              <p className="total-amounts-price">
                {totalPrice.toLocaleString()}원
              </p>
              <p className="total-amounts-text">총 주문금액</p>
            </div>
          </div>
        </div>
        <div className="order-button-box">
          <button className="order-button">주문하기</button>
        </div>
      </div>
    </div>
  );
};
export default CartFilled;
