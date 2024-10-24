export const regions = {
  all: {
    start: 1,
    end: 1025
  },
  kanto: {
    start: 1,
    end: 151,
  },
  johto: {
    start: 152,
    end: 251,
  },
  hoenn: {
    start: 252,
    end: 386,
  },
  sinnoh: {
    start: 387,
    end: 493,
  },
  unova: {
    start: 494,
    end: 649,
  },
  kalos: {
    start: 650,
    end: 721,
  },
  alola: {
    start: 722,
    end: 809,
  },
  galar: {
    start: 810,
    end: 898,
  },
  hisui: {
    start: 899,
    end: 905,
  },
  paldea: {
    start: 906,
    end: 1025,
  },
};

export const typeColors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

export const starters = [1, 4, 7, 25, 
  152, 155, 158, 252, 255, 258, 
  387, 390, 393, 495, 498, 501, 
  650, 653, 656, 722, 725, 728, 
  810, 813, 816, 906, 909, 912
]

export const subLegendaries = [
  144, 145, 146, 243, 244, 245, 377, 378, 
  379, 380, 381, 480, 481, 482, 485, 486, 
  488, 638, 639, 640, 641, 642, 645, 772,
  773, 785, 786, 787, 788, 793, 794, 795, 
  796, 797, 798, 799, 803, 804, 805, 806,
  891, 892, 894, 895, 896, 897, 905, 1001,
  1002, 1003, 1004, 1014, 1015, 1016];

export const legendaries = [
  150, 249, 250, 382, 383, 384, 483, 484, 
  487, 643, 644, 646, 716, 717, 718, 789, 
  790, 791, 792, 800, 888, 889, 890, 898, 
  1007, 1008, 1024];

export const mythicals = [
  151, 251, 385, 386, 489, 490, 491, 492, 
  493, 494, 647, 648, 649, 719, 720, 721, 
  801, 802, 807, 808, 809, 893, 1025];

export const validTypes = [
  "bug", "dark", "dragon", "electric", "fairy", "fighting", 
  "fire", "flying", "ghost", "grass", "ground", "ice", 
  "normal", "poison", "psychic", "rock", "steel", "water"
];

export const dashOutliers = [250, 474, 782, 783, 784, 1001, 1002, 1003, 1004];