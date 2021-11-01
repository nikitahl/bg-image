(function () {
  const body = document.body;
  const form = document.querySelector('.bg-image-form');
  const bgSizeInput = document.querySelector('.bg-size-input');
  const bgPositionInput = document.querySelector('.bg-position-input');
  const imageContainer = document.querySelector('.image-container');
  const imageWidth = document.querySelector('.image-width');
  const imageHeight = document.querySelector('.image-height');
  const getCodeBtn = document.querySelector('.get-code');
  const code = document.querySelector('.code');
  const closeCode = document.querySelector('.code-close');
  const fullStyle = document.querySelector('.full-style');
  const shortStyle = document.querySelector('.short-style');
  const copyButtons = document.querySelectorAll('.btn--copy');

  const bgValues = {
    color: '#999999',
    image: 'bg-image.jpg',
    position: 'left top',
    size: 'contains',
    repeat: 'repeat',
    origin: 'padding-box'
  }

  let rawCode = ''
  let rawShorthandCode = ''

  function setImageSize () {
    const imageContainerRect = imageContainer.getBoundingClientRect();
    imageWidth.innerText = imageContainerRect.width;
    imageHeight.innerText = imageContainerRect.height;
  }

  function getImgData(target, name) {
    const files = target.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        body.style.setProperty(name, `url(${this.result})`);
        const propName = name.slice(5);
        bgValues[propName] = files.name;
      });    
    }
  }

  function handleFormChange (e) {
    let { name, value, type } = e.target;
    const propName = name.slice(5);
    if (name === '--bg-image') {
      getImgData(e.target, name);
    } else {
      if (name === '--bg-position') {
        value = value.split('-').join(' ');
      }

      if (name === '--bg-size') {
        if (value === 'custom') {
          bgSizeInput.classList.remove('hidden');
          value = getComputedStyle(imageContainer).backgroundSize;
        } else if (value !== 'custom' && !bgSizeInput.classList.contains('hidden') && type !== 'text') {
          bgSizeInput.classList.add('hidden');
        } else if (type === 'text') {
          // TODO update validation
          if (!['px', '%', 'em', 'rem', 'pt', 'pc'].find(unit => value.includes(unit))) {
            value = `${value}px`;
          }
        }
      }

      if (name === '--bg-position') {
        if (value === 'custom') {
          bgPositionInput.classList.remove('hidden');
          value = getComputedStyle(imageContainer).backgroundPosition;
        } else if (value !== 'custom' && !bgPositionInput.classList.contains('hidden') && type !== 'text') {
          bgPositionInput.classList.add('hidden');
        } else if (type === 'text') {
          // TODO update validation
          if (!['px', '%', 'em', 'rem', 'pt', 'pc'].find(unit => value.includes(unit))) {
            value = `${value}px`;
          }
        }
      }
      body.style.setProperty(name, value);
      bgValues[propName] = value;
    }
    copyButtons.forEach((button) => {
      button.innerText = 'Copy';
    });
  }

  function imageResizeHandler (entries) {
    for (let entry of entries) {
      setImageSize();
    }
  }

  function closeCodeModal (e) {
    if (!e.target.closest('.code') || e.target.classList.contains('code-close')) {
      code.classList.add('hidden');
      body.classList.remove('modal-opened');
      closeCode.removeEventListener('click', closeCodeModal);
      body.removeEventListener('click', closeCodeModal);
    }
  }

  function openCodeModal (e) {
    generateCode();
    fullStyle.innerText = rawCode;
    shortStyle.innerText = rawShorthandCode;
    code.classList.remove('hidden');
    body.classList.add('modal-opened');
    closeCode.addEventListener('click', closeCodeModal);
    setTimeout(function () {
      body.addEventListener('click', closeCodeModal);
    }, 0);
  }

  function generateCode () {
    rawCode = `.bg-image {
  background-color: ${bgValues.color};
  background-image: url("${bgValues.image}");
  background-position: ${bgValues.position};
  background-size: ${bgValues.size};
  background-repeat: ${bgValues.repeat};
  background-origin: ${bgValues.origin};
}
`;
    rawShorthandCode = `.bg-image {
  background: ${bgValues.color} url("${bgValues.image}") ${bgValues.position} ${bgValues.size} ${bgValues.repeat} ${bgValues.origin};
}`;
  }

  function handleCopyToClipboard (e) {
    let code;
    if (e.target.classList.contains('copy-full')) {
      code = rawCode;
      e.target.innerText = 'Copied';
    } else {
      code = rawShorthandCode;
      e.target.innerText = 'Copied';
    }
    navigator.clipboard.writeText(code);
  }
   
  const resizeObserver = new ResizeObserver(imageResizeHandler);
  resizeObserver.observe(imageContainer);
  form.addEventListener('change', handleFormChange);
  getCodeBtn.addEventListener('click', openCodeModal);

  copyButtons.forEach((button) => {
    button.addEventListener('click', handleCopyToClipboard);
  });
})();