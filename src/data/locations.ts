export interface Location {
    name: string;
    lat: number;
    lng: number;
    type: 'city' | 'fishing_spot';
}

export const locations: Location[] = [
    // Major Cities
    { name: 'București', lat: 44.4268, lng: 26.1025, type: 'city' },
    { name: 'Cluj-Napoca', lat: 46.7712, lng: 23.6236, type: 'city' },
    { name: 'Timișoara', lat: 45.7489, lng: 21.2087, type: 'city' },
    { name: 'Iași', lat: 47.1585, lng: 27.6014, type: 'city' },
    { name: 'Constanța', lat: 44.1792, lng: 28.6121, type: 'city' },
    { name: 'Craiova', lat: 44.3302, lng: 23.7949, type: 'city' },
    { name: 'Brașov', lat: 45.6427, lng: 25.5542, type: 'city' },
    { name: 'Galați', lat: 45.4353, lng: 28.0080, type: 'city' },
    { name: 'Ploiești', lat: 44.9367, lng: 26.0129, type: 'city' },
    { name: 'Oradea', lat: 47.0465, lng: 21.9189, type: 'city' },
    { name: 'Brăila', lat: 45.2692, lng: 27.9575, type: 'city' },
    { name: 'Arad', lat: 46.1866, lng: 21.3123, type: 'city' },
    { name: 'Pitești', lat: 44.8565, lng: 24.8697, type: 'city' },
    { name: 'Sibiu', lat: 45.7983, lng: 24.1256, type: 'city' },
    { name: 'Bacău', lat: 46.5670, lng: 26.9146, type: 'city' },
    { name: 'Târgu Mureș', lat: 46.5456, lng: 24.5625, type: 'city' },
    { name: 'Baia Mare', lat: 47.6533, lng: 23.5795, type: 'city' },
    { name: 'Buzău', lat: 45.1508, lng: 26.8169, type: 'city' },
    { name: 'Botoșani', lat: 47.7410, lng: 26.6664, type: 'city' },
    { name: 'Satu Mare', lat: 47.7900, lng: 22.8857, type: 'city' },

    // Famous Fishing Spots
    { name: 'Delta Dunării (Sulina)', lat: 45.1556, lng: 29.6546, type: 'fishing_spot' },
    { name: 'Delta Dunării (Sf. Gheorghe)', lat: 44.8889, lng: 29.5960, type: 'fishing_spot' },
    { name: 'Delta Dunării (Chilia Veche)', lat: 45.4239, lng: 29.2844, type: 'fishing_spot' },
    { name: 'Dunăre (Cazane)', lat: 44.6333, lng: 22.2833, type: 'fishing_spot' },
    { name: 'Lacul Morii', lat: 44.4550, lng: 26.0350, type: 'fishing_spot' },
    { name: 'Lacul Snagov', lat: 44.7000, lng: 26.1667, type: 'fishing_spot' },
    { name: 'Lacul Vidraru', lat: 45.3667, lng: 24.6167, type: 'fishing_spot' },
    { name: 'Lacul Bicaz', lat: 46.9467, lng: 26.1039, type: 'fishing_spot' },
    { name: 'Balta Sărulești', lat: 44.4100, lng: 26.6500, type: 'fishing_spot' },
];
