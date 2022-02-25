document.addEventListener('DOMContentLoaded', () => {
  const closePopup = new ClosePopup(180);
  const dropdown = new Dropdown();
});

window.addEventListener('load', () => {
  const slider = new PageControl(document.getElementById('slider'), 1, 3000, 1); //right : 1, left : 0
  // slider.hover();
  slider.toggle();
  slider.paginationClick();
  slider.pagerClick();

  const roller = new Roller(document.getElementById('roller'));
  roller.auto();

  const posterHide = new PosterHide();
  posterHide.hide();
}); // load

class ClosePopup {
  constructor(paddingTop) {
    this.paddingTop = paddingTop;
    this.banner = document.querySelector('.js_popup');
    this.btn = this.banner.querySelector('.js_btn');
    this.close();
  }

  close() {
    this.btn.addEventListener('click', () => {
      this.banner.style.display = 'none';
      document.querySelector('.js_main').style.paddingTop = `${this.paddingTop}px`;
    });
  }
}

class Dropdown {
  constructor() {
    this.link = document.querySelectorAll('.js_gnb_link');
    this.local = document.querySelectorAll('.js_lnb');
    this.remove();
    this.add();
  }

  remove() {
    this.link.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        this.local.forEach((element) => {
          element.classList.remove('is_hidden');
        });
      });
    });
  }

  add() {
    this.link.forEach((element) => {
      element.addEventListener('mouseleave', () => {
        this.local.forEach((element) => {
          element.classList.add('is_hidden');
        });
      });
    });
  }
} //  class Dropdown

class PosterHide {
  constructor() {
    this.poster = document.querySelector('.js_videoPoster');
    this.play = this.poster.querySelector('.js_videoPlay');
  }

  hide() {
    this.play.addEventListener('click', () => {
      this.poster.style.height = 0;
      this.poster.style.opacity = 0;
    });
  }
} // videoPoster hide

class Roller {
  constructor(rollerID) {
    this.cntr = rollerID.querySelector('.js_cntr');
    this.item = rollerID.querySelectorAll('.js_cntr > li');
    this.prev = rollerID.querySelector('.js_roller_prev');
    this.next = rollerID.querySelector('.js_roller_next');
    this.width = this.cntr.offsetWidth;
    this.len = this.item.length;
    this.halfLen = Math.floor(this.len / 2);
    this.itemArr = [];
    this.setIntervalId;
    this.setTimeoutId;

    this.init();
    this.addEvent();
  }

  init() {
    if (this.len / 2 !== 0) {
      for (let i = 0; i < this.len; i++) {
        this.itemArr[i] = this.item[i];
      }
      this.itemArr[this.len] = this.item[0].cloneNode(true);
      this.cntr.append(this.itemArr[this.len]);
      this.len++;
      this.halfLen++;
      this.itemArr.forEach((element) => {
        element.style.width = `${this.width / this.halfLen}px`;
      });
    } else {
      this.item.forEach((element) => {
        element.style.width = `${this.width / this.halfLen}px`;
      });
    }
  }

  toLeft() {
    this.cntr.style.transform = `translateX(${-this.width}px)`;
    for (let i = 0; i < this.halfLen; i++) {
      this.cntr.prepend(this.itemArr[i]);
    }
  }

  toRight() {
    this.cntr.style.transform = `translateX(0px)`;
    for (let i = 0; i < this.halfLen; i++) {
      this.cntr.append(this.itemArr[this.halfLen + i]);
    }
  }

  classToggle() {
    this.prev.classList.toggle('is_active');
    this.next.classList.toggle('is_active');
  }

  auto() {
    this.setIntervalId = setInterval(() => {
      this.toLeft();
      this.classToggle();
      setTimeout(() => {
        this.toRight();
        this.classToggle();
      }, 3000);
    }, 6000);
  }

  stop() {
    clearTimeout(this.setTimeoutId);
    clearInterval(this.setIntervalId);
  }

  addEvent() {
    this.prev.addEventListener('mouseover', () => {
      this.stop();
    });
    this.prev.addEventListener('mouseout', () => {
      this.auto();
    });

    this.next.addEventListener('mouseover', () => {
      this.stop();
    });
    this.next.addEventListener('mouseout', () => {
      this.auto();
    });

    this.prev.addEventListener('click', (event) => {
      if (!event.currentTarget.classList.contains('is_active')) {
        this.toRight();
        this.classToggle();
      }
    });
    this.next.addEventListener('click', (event) => {
      if (!event.currentTarget.classList.contains('is_active')) {
        this.toLeft();
        this.classToggle();
      }
    });
  }
}

class Slider {
  constructor(sliderId, sliderCount, sliderSpeed, sliderDir) {
    this.slider = sliderId;
    this.count = sliderCount;
    this.speed = sliderSpeed;
    this.container = this.slider.querySelector('.js_cntr');
    this.item = this.slider.querySelectorAll('.js_cntr > li');
    this.len = this.item.length;
    this.width = this.item[0].offsetWidth;
    this.startNum = 0;
    this.currItem;
    this.currIndex;
    this.intervalID;

    this.init();
    this.moveTo = sliderDir ? this.toRight : this.toLeft;
    this.auto();
  }

  init() {
    this.container.style.width = `${this.width * (this.len + this.count - 1)}px`;

    const headClone = [];
    const tailClone = [];
    const halfCount = Math.floor(this.count / 2);
    for (let i = 0; i < halfCount; i++) {
      headClone[i] = this.item[this.len - 1 - i].cloneNode(true);
      tailClone[i] = this.item[i].cloneNode(true);
    }
    for (let i = 0; i < halfCount; i++) {
      this.container.prepend(headClone[i]);
      this.container.append(tailClone[i]);
    }

    this.container.style.transform = `translateX(0px)`;

    this.currIndex = this.startNum;
    this.currItem = this.item[this.currIndex];
    this.currItem.classList.add('is_active');
  }

  active(direction) {
    this.currItem.classList.remove('is_active');
    this.currItem = direction ? this.item[++this.currIndex] : this.item[--this.currIndex];
    this.currItem.classList.add('is_active');
  }

  toRight() {
    if (this.currIndex <= this.len - 1) {
      this.container.style.transition = `${this.speed}ms`;
      this.container.style.transform = `translateX(-${this.width * (this.currIndex + 1)}px)`;
    }
    if (this.currIndex === this.len - 1) {
      this.container.style.transition = `0ms`;
      this.container.style.transform = `translateX(0px)`;
      this.currIndex = -1;
    }
    this.active(1);
  }

  toLeft() {
    if (this.currIndex >= 0) {
      this.container.style.transition = `${this.speed}ms`;
      this.container.style.transform = `translateX(-${this.width * (this.currIndex - 1)}px)`;
    }
    if (this.currIndex === 0) {
      this.container.style.transition = `0ms`;
      this.container.style.transform = `translateX(-${this.width * (this.len - 1)}px)`;
      this.currIndex = this.len;
    }
    this.active(0);
  }

  auto() {
    this.intervalID = setInterval(() => {
      this.moveTo();
    }, this.speed);
  }

  stop() {
    clearInterval(this.intervalID);
  }

  hover() {
    this.item.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        this.stop();
      });
      element.addEventListener('mouseleave', () => {
        this.auto();
      });
    });
  }
} // class Slider

class PageControl extends Slider {
  constructor(sliderId, sliderCount, sliderSpeed, sliderDir) {
    super(sliderId, sliderCount, sliderSpeed, sliderDir);
    this.pagination = this.slider.querySelector('.js_pagination');
    this.pageItem = this.pagination.childNodes;
    this.switch = this.slider.querySelector('.js_switch');
    this.pager = this.slider.querySelectorAll('.js_pager > button');

    this.createPagination();
  }

  createPagination() {
    this.pageElem = '';
    for (let i = 0; i < this.len; i++) {
      this.pageElem += `<li class="`;
      this.pageElem += i === this.startNum ? `is_active` : '';
      this.pageElem += `" data-index="${i}"><button></button></li>`;
    }
    this.pagination.innerHTML = this.pageElem;
  }

  active(direction) {
    this.currItem.classList.remove('is_active');
    switch (this.currIndex) {
      case -1:
        this.pageItem[this.len - 1].classList.remove('is_active');
        break;
      case this.len:
        this.pageItem[0].classList.remove('is_active');
        break;
      default:
        this.pageItem[this.currIndex].classList.remove('is_active');
    }
    this.currItem = direction ? this.item[++this.currIndex] : this.item[--this.currIndex];
    this.currItem.classList.add('is_active');
    this.pageItem[this.currIndex].classList.add('is_active');
  }

  pause(target) {
    target.classList.remove('is_active');
    super.stop();
  }

  play(target) {
    target.classList.add('is_active');
    super.auto();
  }

  toggle() {
    this.switch.addEventListener('click', (event) => {
      if (event.currentTarget.classList.contains('is_active')) {
        this.pause(event.currentTarget);
      } else {
        this.play(event.currentTarget);
      }
    });
  }

  paginationClick() {
    let currPage = undefined;
    this.pageItem.forEach((element) => {
      element.addEventListener('click', (event) => {
        this.pause(this.switch);
        currPage = this.pagination.querySelector('.is_active');
        currPage.classList.remove('is_active');
        currPage = event.currentTarget;
        currPage.classList.add('is_active');
        this.currItem.classList.remove('is_active');
        this.currIndex = Number(currPage.getAttribute('data-index'));
        this.currItem = this.item[this.currIndex];
        this.currItem.classList.add('is_active');
        this.container.style.transition = `${this.speed}ms`;
        this.container.style.transform = `translateX(-${this.width * this.currIndex}px)`;
      });
    });
  }

  pagerClick() {
    this.pager.forEach((element) => {
      element.addEventListener('click', (event) => {
        super.stop();
        if (event.target.classList.contains('hp_chevLeft')) {
          super.toLeft();
        } else if (event.target.classList.contains('hp_chevRight')) {
          super.toRight();
        }
        super.auto();
      });
    });
  }
} // class PageControl extends Slider

