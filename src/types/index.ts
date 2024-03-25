export type IContextType = {
  util:IUtil,
  isLoading:boolean,
  setUtil: React.Dispatch<React.SetStateAction<IUtil>>,
  isAuthenticated:boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUtil: () => Promise<boolean>
}
export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IActualiserUtil = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INouvellePubli = {
    utilId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IActualiserPubli = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUtil = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  
  export type INouvelUtil = {
    name: string;
    email: string;
    username: string;
    password: string;
  };