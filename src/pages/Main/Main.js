import React, { useState, useRef, useEffect } from 'react';
import './Main.scss';

export default function Main() {
  //인덱스 저장
  const [currentIndex, setCurrentIndex] = useState(1);
  const [slideImgData, setSlideImgData] = useState([]);
  // 카운트
  const [count, setCount] = useState(0);
  // 이미지가 몇 초마다 이동할 지
  const slideRef = useRef(null);
  // 버튼 상태
  const [clickButton, setClickButton] = useState(false);

  useEffect(() => {
    fetch('data/data.json')
      .then(response => response.json())
      .then(data => {
        setSlideImgData([data[data.length - 1], ...data, data[0]]);
      });
  }, []);

  console.log(slideImgData, currentIndex);

  // 버튼 재생 스탑
  function playHandle() {
    console.log('click!');
  }

  //슬라이드 정방향으로 넘어가는 조건
  const slideIndex = () => {
    if (currentIndex === slideImgData.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(value => value + 1);
    }
  };
  //슬라이드가 이전으로 넘어가는 조건
  const leftSlide = () => {
    if (currentIndex === 0) {
      setCurrentIndex(slideImgData.length - 1);
    } else {
      setCurrentIndex(value => value - 1);
    }
  };

  //슬라이드 재생 멈춤

  useEffect(() => {
    const slideTime = setTimeout(() => {
      slideIndex();
    }, 3000);

    return () => clearTimeout(slideTime);
  }, [currentIndex]);

  useEffect(() => {
    // const isLastImgIdx = currentIndex === slideImgData.length - 1;

    // if (isLastImgIdx) {
    //   slideRef.current.style.transition = 'none';
    //   setCurrentIndex(1);

    //   return;
    // }

    slideRef.current.style.transition = `${0.5}s`;
    slideRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, [currentIndex]);

  return (
    <div className="main-container">
      <div className="slider">
        <div className="slideShow">
          <div className="slide-item" ref={slideRef} count={count}>
            {slideImgData.map((slide, index) => (
              <img
                className="slide-item-image"
                key={index}
                src={slide.img}
              ></img>
            ))}
          </div>
          <div className="prev-btn">
            <img
              alt="prev-btn"
              src="./images/main/leftarrow.png"
              onClick={leftSlide}
            />
          </div>
          <div className="next-btn-play">
            <div className="next-btn">
              <img
                alt="next-btn"
                src="./images/main/rightarrow.png"
                onClick={slideIndex}
              />
            </div>
            <div className="play-btn">
              <img
                className="play-btn-icon"
                alt="play-btn"
                src="./images/main/play.png"
                onClick={playHandle}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="our-pick inner">
        <h2 className="ourpick-title">Our Picks</h2>
        <ul className="ourpick-photo">
          <li></li>
        </ul>
      </div>
    </div>
  );
}
