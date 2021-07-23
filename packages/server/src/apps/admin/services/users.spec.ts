import "reflect-metadata";
import { container } from "tsyringe";
import {
  IStorageService,
  StorageServiceIdentifier,
} from "../../../services/storage";
import {
  ITokenInfo,
  TokenService,
  TokenServiceIdentifier,
} from "../../../services/token";
import { IUserInfo, UserService } from "./users";

/**
 * mock storage service
 */
const data: { [key: string]: any } = {};
class StorageService implements IStorageService {
  get<T>(key: string) {
    return data[key] as unknown as T;
  }
  set<T>(key: string, value: T) {
    data[key] = value;
  }
  delete(key: string) {
    delete data[key];
  }
}

container.register(StorageServiceIdentifier, {
  useClass: StorageService,
});

container.register(TokenServiceIdentifier, {
  useClass: TokenService,
});

const publicUserInfo = {
  username: "admin",
};

const userInfo = {
  ...publicUserInfo,
  password: "admin",
};

const userService = container.resolve(UserService);
let info: IUserInfo & ITokenInfo;
let tokens: ITokenInfo;

describe("signup", () => {
  it("should signup with admin/admin", () => {
    const info = userService.signUp(userInfo.username, userInfo.password);
    expect(info).toMatchObject(publicUserInfo);
    expect(info).toHaveProperty("access");
    expect(info).toHaveProperty("refresh");
  });

  it("should throw 'user exists'", () => {
    expect(() => {
      userService.signUp(userInfo.username, userInfo.password);
    }).toThrow("user exists");
  });
});

describe("signin", () => {
  it("should signin", () => {
    info = userService.signIn(userInfo.username, userInfo.password);
    expect(info).toMatchObject(publicUserInfo);
    expect(info).toHaveProperty("access");
    expect(info).toHaveProperty("refresh");
  });

  it("should throw 'user not found' error", () => {
    expect(() => {
      userService.signIn("hi", "pwd");
    }).toThrow("user not found");
  });

  it("should throw 'wrong username or password'", () => {
    expect(() => {
      userService.signIn(userInfo.username, "admin2");
    }).toThrow("wrong username or password");
  });
});

describe("info", () => {
  it("should get user info", () => {
    const givenInfo = userService.getInfo(info.access);
    expect(givenInfo).toMatchObject(publicUserInfo);
  });

  it("refresh token should fail", () => {
    expect(() => {
      userService.getInfo(info.refresh);
    }).toThrowError();
  });
});

describe("auth", () => {
  it("should pass verify", () => {
    userService.verify(info.access);
  });

  it("refresh token should fail verify", () => {
    expect(() => {
      userService.verify(info.refresh);
    }).toThrow("require access token");
  });

  it("wrong token should fail verify", () => {
    expect(() => {
      userService.verify("123123");
    }).toThrowError();
  });

  it("should refresh", () => {
    tokens = userService.refresh(info.refresh);
  });

  it("new token should work", () => {
    userService.getInfo(tokens.access);
  });

  it("access token should fail refresh", () => {
    expect(() => {
      tokens = userService.refresh(tokens.access);
    }).toThrow("refresh");
  });
});

describe("signoff", () => {
  it("should signoff", () => {
    userService.signOff(tokens.refresh);
  });

  it("signoff should ban old refresh token", () => {
    expect(() => {
      userService.refresh(tokens.refresh);
    }).toThrowError();
  });
});
