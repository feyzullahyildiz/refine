import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { Route } from "react-router-dom";

import { MockJSONServer, TestWrapper, act } from "@test";
import { posts } from "@test/dataMocks";

import { useShow } from "./useShow";

const Wrapper = TestWrapper({
    dataProvider: MockJSONServer,
    resources: [{ name: "posts", route: "posts" }],
    routerInitialEntries: ["/posts/show/1"],
});

const WrapperWithRoute: React.FC = ({ children }) => (
    <Wrapper>
        <Route path="/:resource/:action/:id">{children}</Route>
    </Wrapper>
);
describe("useShow Hook", () => {
    it("should fetch data with use-query params succesfully", async () => {
        const { result, waitFor } = renderHook(() => useShow(), {
            wrapper: WrapperWithRoute,
        });

        await waitFor(() => {
            return result.current.queryResult.isSuccess;
        });

        expect(result.current.queryResult.data?.data.id).toEqual(posts[0].id);
    });

    it("should fetch data with hook params succesfully", async () => {
        const { result, waitFor } = renderHook(
            () => useShow({ resource: "posts", id: "1" }),
            {
                wrapper: WrapperWithRoute,
            },
        );

        await waitFor(() => {
            return result.current.queryResult.isSuccess;
        });

        expect(result.current.queryResult.data?.data.id).toEqual(posts[0].id);
    });

    it("correctly return id value from options", async () => {
        const { result } = renderHook(
            () =>
                useShow({
                    id: "2",
                }),
            {
                wrapper: WrapperWithRoute,
            },
        );

        expect(result.current.showId).toEqual("2");
    });

    it("correctly return id value from route", async () => {
        const { result } = renderHook(() => useShow(), {
            wrapper: WrapperWithRoute,
        });

        expect(result.current.showId).toEqual("1");
    });

    it("correctly return id value which was set with setShowId after it was set", async () => {
        const { result } = renderHook(() => useShow(), {
            wrapper: WrapperWithRoute,
        });

        expect(result.current.showId).toEqual("1");

        act(() => {
            result.current.setShowId("3");
        });

        expect(result.current.showId).toEqual("3");
    });
});
