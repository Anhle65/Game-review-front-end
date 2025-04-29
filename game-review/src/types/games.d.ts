type Game = {
    gameId: number;
    title: string;
    description: string;
    creation_date: string;
    image_filename: string;
    creator_id: number;
    genre_id: number;
    price: number;
}
type Game_Details = {
    gameId: number;
    title: string;
    genreId: number;
    creationDate: string;
    creatorId: number;
    price: number;
    creatorFirstName: string;
    creatorLastName: string;
    rating: number;
    platformIds: string;
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
