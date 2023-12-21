/*

Fetch 接口
    fetch() 包含了 fetch() 方法，用于获取资源。
    Headers 表示响应/请求的标头信息，允许你查询它们，或者针对不同的结果做不同的操作。
    Request 相当于一个资源请求。
    Response 相当于请求的响应

fetch 参数：
    method: 请求使用的方法，如 GET、POST。
    headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量
    body: 请求的 body 信息：可能是一个 Blob、BufferSource(x禁止)、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
    mode: 请求的模式，如 cors、no-cors 或者 same-origin。
    credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie，必须提供这个选项，从 Chrome 50 开始，这个属性也可以接受 FederatedCredential (en-US) 实例或是一个 PasswordCredential (en-US) 实例。

*/

function httpfetch<T>(options: {
  url: string;
  method: string;
  body?: BodyInit;
  data?: any;
}): Promise<T> {
  // 设置请求头
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // 配置常用设置 method 请求方式 headers 请求头
  let myInit: RequestInit = {
    method: options.method,
    headers: myHeaders,
    mode: "cors",
    cache: "default",
    body: options.body as BodyInit,
  };
  let request = new Request(options.url);
  if (options.method === "GET") {
    let searchParams = new URLSearchParams();
    // for (let key in options.data) {
    //   searchParams.append(key, options.data[key]);
    // }
    Object.entries(options.data || {})?.map((m) => {
      searchParams.append(m[0], m[1] as string);
    });
    let concatenatedURL = options.url + "?" + searchParams.toString();
    request = new Request(
      process.env.NEXT_PUBLIC_URL + concatenatedURL,
      myInit
    );
  } else {
    request = new Request(process.env.NEXT_PUBLIC_URL + options.url, myInit);
  }

  return new Promise((resolved, rejected) => {
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something went wrong on API server!");
        }
      })
      .then((response) => {
        resolved(response);
      })
      .catch((error) => {
        rejected(error);
      });
  });
}

export default httpfetch;
