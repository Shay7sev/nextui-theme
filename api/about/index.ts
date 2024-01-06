import httpfetch from "../fetch";
import { ResPage, ResultData } from "../typing";
import { ReqUser, ResUser } from "./typing";

export function getAboutList(_url: string = "", { arg }: { arg: ReqUser }) {
  return httpfetch<ResultData<ResPage<ResUser>>>({
    url: "/get-page",
    method: "GET",
    // body: JSON.stringify(arg),
    data: arg,
  });
}

export function getDocsList(_url: string = "", { arg }: { arg: ReqUser }) {
  return httpfetch<ResultData<ResPage<ResUser>>>({
    url: "/get-page-docs",
    method: "GET",
    // body: JSON.stringify(arg),
    data: arg,
  });
}
