import React from 'react';

const IMAGES = {
  accessory: [
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_1.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_2.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_3.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_4.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_5.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_6.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_7.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_8.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_9.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_10.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_11.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_12.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_13.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_14.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_15.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_16.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_17.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_18.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_19.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_20.png`
  ],
  body: [
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_1.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_2.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_3.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_4.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_5.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_6.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_7.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_8.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_9.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_10.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_11.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_12.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_13.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_14.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_15.png`
  ],
  eyes: [
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_1.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_2.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_3.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_4.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_5.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_6.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_7.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_8.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_9.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_10.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_11.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_12.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_13.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_14.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_15.png`
  ],
  mouth: [
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_1.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_2.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_3.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_4.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_5.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_6.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_7.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_8.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_9.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_10.png`
  ],
  fur: [
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_1.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_2.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_3.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_4.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_5.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_6.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_7.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_8.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_9.png`,
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_10.png`
  ]
};

const dnaToAttributes = dna => {
  const attribute = (index, type) => IMAGES[type][dna[index] % IMAGES[type].length];

  return {
    body: attribute(0, 'body'),
    eyes: attribute(1, 'eyes'),
    accessory: attribute(2, 'accessory'),
    fur: attribute(3, 'fur'),
    mouth: attribute(4, 'mouth')
  };
};

const KittyAvatar = props => {
  const outerStyle = { height: '160px', position: 'relative', width: '50%' };
  const innerStyle = { height: '150px', position: 'absolute', top: '3%', left: '50%' };
  const { dna } = props;

  if (!dna) return null;

  const cat = dnaToAttributes(dna);
  return <div style={outerStyle}>
    <img alt='body' src={cat.body} style={innerStyle} />
    <img alt='fur' src={cat.fur} style={innerStyle} />
    <img alt='mouth' src={cat.mouth} style={innerStyle} />
    <img alt='eyes' src={cat.eyes} style={innerStyle} />
    <img alt='accessory' src={cat.accessory} style={innerStyle} />
  </div>;
};

export default KittyAvatar;
