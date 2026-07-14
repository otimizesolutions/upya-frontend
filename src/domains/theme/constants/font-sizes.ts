import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const widthPercentageToDP = (widthPercent: string) => {
  const screenWidth = width < height ? width : height;
  return PixelRatio.roundToNearestPixel(
    (screenWidth * parseFloat(widthPercent)) / 100,
  );
};

export const veryBig = widthPercentageToDP('16%');
export const big = widthPercentageToDP('9.5%');
export const titleBig = widthPercentageToDP('7%');
export const title = widthPercentageToDP('6%');
export const subTitle = widthPercentageToDP('6%');
export const mediumTitle = widthPercentageToDP('5.5%');
export const high = widthPercentageToDP('5%');
export const medium = widthPercentageToDP('4.5%');
export const regular = widthPercentageToDP('4%');
export const small = widthPercentageToDP('3.5%');
export const verySmall = widthPercentageToDP('2.5%');
