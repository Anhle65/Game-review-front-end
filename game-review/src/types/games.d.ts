type Game = {
    gameId: number;
    title: string;
    genreId: number;
    creationDate: string;
    creatorId: number;
    price: number;
    creatorFirstName: string;
    creatorLastName: string;
    rating: number;
    platformIds: number[];
    description: string;
    numberOfWishlists: number;
    numberOfOwners: number;
    rating: number;
}
type Game_platforms = {
    id: number;
    game_id: number;
    platform_id: number;
}
type Wishlist = {
    id: number;
    game_id: number;
    user_id: number;
}
type Owned = {
    id: number;
    game_id: number;
    user_id: number;
}
