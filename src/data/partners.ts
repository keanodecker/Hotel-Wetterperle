import boettger from '../assets/extracted/partners/boettger.png';
import kaffeebrewda from '../assets/extracted/partners/kaffeebrewda.png';
import knau from '../assets/extracted/partners/knau.png';
import scharch from '../assets/extracted/partners/scharch.png';
import winzer from '../assets/extracted/partners/winzer.png';
import wisentageist from '../assets/extracted/partners/wisentageist.png';

export interface Partner {
	name: string;
	logo: ImageMetadata;
}

export const partners: Partner[] = [
	{ name: 'Böttger', logo: boettger },
	{ name: 'Kaffeebrewda', logo: kaffeebrewda },
	{ name: 'Knau', logo: knau },
	{ name: 'Scharch', logo: scharch },
	{ name: 'Winzer', logo: winzer },
	{ name: 'Wisentageist', logo: wisentageist },
];
