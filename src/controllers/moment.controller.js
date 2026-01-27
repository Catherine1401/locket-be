import {
  getFriendshipByUserId,
  getFriendShipsByUserId,
} from "../models/friend.model.js";
import {
  createMoment,
  deleteMomentByIdAndUserId,
  getMomentById,
  getMomentsByFriendIdAndMyId,
  getMomentsByNextCursor,
  getMomentsByNextCursorAndUserId,
  getMomentsByPrevCursor,
  getMomentsByPrevCursorAndUserId,
  getMomentsByUserId,
} from "../models/moment.model.js";

export const createMomentController = async (req, res) => {
  try {
    const { userId } = req;
    const image = req.file.path;
    const { caption } = req.body;
    console.log("image from create moment", image);
    const moment = await createMoment(userId, image, caption);
    console.log("moment from create moment", moment);

    const momentResponse = {
      id: moment.id,
      imageUrl: moment.image_url,
      caption: moment.caption,
      userId: moment.user_id,
      createdAt: moment.created_at,
    };
    res.json(momentResponse);
  } catch (e) {
    console.error("error from create moment", e);
    res.status(500).json({ message: "error from create moment" });
  }
};

export const deleteMomentController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const moment = await deleteMomentByIdAndUserId(id, userId);

    if (!moment)
      return res
        .status(404)
        .json({ message: "moment not found or not your moment" });

    console.log("moment from delete moment", moment);
    res.json({ message: "moment deleted" });
  } catch (e) {
    console.error("error from delete moment", e);
    res.status(500).json({ message: "error from delete moment" });
  }
};

export const feedMomentController = async (req, res) => {
  // get info
  const { limit: limitString, prevCursor, nextCursor } = req.query;
  const { userId } = req;
  const limit = parseInt(limitString);
  console.log("prevCursor", prevCursor);
  console.log("type of prevCursor", typeof prevCursor);
  console.log("nextCursor", nextCursor);
  console.log("type of nextCursor", typeof nextCursor);
  console.log("limit", limit);
  console.log("type of limit", typeof limit);
  console.log("check", !prevCursor && !!nextCursor);

  try {
    // get friendIds
    const friendships = await getFriendShipsByUserId(userId);
    const friendIds = friendships.map((friendship) => {
      return friendship.user_id1 === userId
        ? friendship.user_id2
        : friendship.user_id1;
    });
    console.log("friendships from feed moment", friendships);
    console.log("friendIds from feed moment", friendIds);

    // first load
    if (!prevCursor && !nextCursor) {
      const moments = await getMomentsByFriendIdAndMyId(
        friendIds,
        userId,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: true,
        nextEnd: moments.length === 20 ? false : true,
      };
      res.json(response);

      // scroll down
    } else if (!prevCursor && !!nextCursor) {
      const moments = await getMomentsByNextCursor(
        nextCursor,
        userId,
        friendIds,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        nextCursor: moments[moments.length - 1].id,
        nextEnd: moments.length === 20 ? false : true,
      };
      res.json(response);

      // scroll up
    } else if (!!prevCursor && !nextCursor) {
      const moments = await getMomentsByPrevCursor(
        prevCursor,
        userId,
        friendIds,
        limit,
      );

      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        prevEnd: moments.length === 20 ? false : true,
      };
      res.json(response);

      // grid to feed
    } else if (!!prevCursor && !!nextCursor) {
      if (prevCursor !== nextCursor)
        return res
          .status(406)
          .json({ message: "nextCursor and prevCursor not equal" });

      const halfLimit = limit / 2;
      const currentMoment = await getMomentById(prevCursor);
      if (!currentMoment)
        return res.status(404).json({ message: "no moments found" });

      const nextMoment = await getMomentsByNextCursor(
        nextCursor,
        userId,
        friendIds,
        halfLimit,
      );
      if (nextMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const prevMoment = await getMomentsByPrevCursor(
        prevCursor,
        userId,
        friendIds,
        halfLimit - 1,
      );
      if (prevMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const moments = [...prevMoment, currentMoment, ...nextMoment];
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: prevMoment.length === halfLimit - 1 ? false : true,
        nextEnd: nextMoment.length === halfLimit ? false : true,
      };
      res.json(response);
    } else {
      res.status(404).json({ message: "error from feed moment" });
    }
  } catch (e) {
    console.error("error from feed moment", e);
    res.status(500).json({ message: "error from feed moment" });
  }
};

export const gridMomentController = async (req, res) => {
  // get info
  const { limit: limitString, prevCursor, nextCursor } = req.query;
  const { userId } = req;
  const limit = parseInt(limitString);
  console.log("prevCursor", prevCursor);
  console.log("type of prevCursor", typeof prevCursor);
  console.log("nextCursor", nextCursor);
  console.log("type of nextCursor", typeof nextCursor);
  console.log("limit", limit);
  console.log("type of limit", typeof limit);
  console.log("check", !prevCursor && !!nextCursor);

  try {
    // get friendIds
    const friendships = await getFriendShipsByUserId(userId);
    const friendIds = friendships.map((friendship) => {
      return friendship.user_id1 === userId
        ? friendship.user_id2
        : friendship.user_id1;
    });
    console.log("friendships from feed moment", friendships);
    console.log("friendIds from feed moment", friendIds);

    // scroll down
    if (!prevCursor && !!nextCursor) {
      const moments = await getMomentsByNextCursor(
        nextCursor,
        userId,
        friendIds,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });
      const response = {
        moments: responseMoments,
        nextCursor: moments[moments.length - 1].id,
        nextEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // scroll up
    } else if (!!prevCursor && !nextCursor) {
      const moments = await getMomentsByPrevCursor(
        prevCursor,
        userId,
        friendIds,
        limit,
      );

      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        prevEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // first load
    } else if (!!prevCursor && !!nextCursor) {
      if (prevCursor !== nextCursor)
        return res
          .status(406)
          .json({ message: "nextCursor and prevCursor not equal" });

      const halfLimit = limit / 2;
      const currentMoment = await getMomentById(prevCursor);
      if (!currentMoment)
        return res.status(404).json({ message: "no moments found" });

      const nextMoment = await getMomentsByNextCursor(
        nextCursor,
        userId,
        friendIds,
        halfLimit,
      );
      if (nextMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const prevMoment = await getMomentsByPrevCursor(
        prevCursor,
        userId,
        friendIds,
        halfLimit - 1,
      );
      if (prevMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const moments = [...prevMoment, currentMoment, ...nextMoment];
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: prevMoment.length === halfLimit - 1 ? false : true,
        nextEnd: nextMoment.length === halfLimit ? false : true,
      };
      res.json(response);
    } else {
      res.status(404).json({ message: "error from feed moment" });
    }
  } catch (e) {
    console.error("error from feed moment", e);
    res.status(500).json({ message: "error from feed moment" });
  }
};

export const feedMomentByUserController = async (req, res) => {
  // get info
  const { limit: limitString, prevCursor, nextCursor } = req.query;
  const { userId: myId } = req;
  const { id: partnerId } = req.params;
  const limit = parseInt(limitString);
  console.log("prevCursor", prevCursor);
  console.log("type of prevCursor", typeof prevCursor);
  console.log("nextCursor", nextCursor);
  console.log("type of nextCursor", typeof nextCursor);
  console.log("limit", limit);
  console.log("type of limit", typeof limit);
  console.log("check", !prevCursor && !!nextCursor);

  try {
    // check friend
    const friendship = await getFriendshipByUserId(myId, partnerId);
    if (!friendship)
      return res.status(404).json({ message: "no friendship found" });

    // first load
    if (!prevCursor && !nextCursor) {
      const moments = await getMomentsByUserId(partnerId, limit);
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: true,
        nextEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // scroll down
    } else if (!prevCursor && !!nextCursor) {
      const moments = await getMomentsByNextCursorAndUserId(
        nextCursor,
        partnerId,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        nextCursor: moments[moments.length - 1].id,
        nextEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // scroll up
    } else if (!!prevCursor && !nextCursor) {
      const moments = await getMomentsByPrevCursorAndUserId(
        prevCursor,
        partnerId,
        limit,
      );

      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        prevEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // grid to feed
    } else if (!!prevCursor && !!nextCursor) {
      if (prevCursor !== nextCursor)
        return res
          .status(406)
          .json({ message: "nextCursor and prevCursor not equal" });

      const halfLimit = limit / 2;
      const currentMoment = await getMomentById(prevCursor);
      if (!currentMoment)
        return res.status(404).json({ message: "no moments found" });

      const nextMoment = await getMomentsByNextCursorAndUserId(
        nextCursor,
        partnerId,
        halfLimit,
      );
      if (nextMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const prevMoment = await getMomentsByPrevCursorAndUserId(
        prevCursor,
        partnerId,
        halfLimit - 1,
      );

      if (prevMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });

      const moments = [...prevMoment, currentMoment, ...nextMoment];
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          imageUrl: moment.image_url,
          caption: moment.caption,
          userId: moment.user_id,
          createdAt: moment.created_at,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: prevMoment.length === halfLimit - 1 ? false : true,
        nextEnd: nextMoment.length === halfLimit ? false : true,
      };
      res.json(response);
    } else {
      res.status(404).json({ message: "error from feed moment" });
    }
  } catch (e) {
    console.error("error from feed moment", e);
    res.status(500).json({ message: "error from feed moment" });
  }
};

// grid moments by user controller
export const gridMomentByUserController = async (req, res) => {
  // get info
  const { limit: limitString, prevCursor, nextCursor } = req.query;
  const { userId: myId } = req;
  const { id: partnerId } = req.params;
  const limit = parseInt(limitString);
  console.log("prevCursor", prevCursor);
  console.log("type of prevCursor", typeof prevCursor);
  console.log("nextCursor", nextCursor);
  console.log("type of nextCursor", typeof nextCursor);
  console.log("limit", limit);
  console.log("type of limit", typeof limit);
  console.log("check", !prevCursor && !!nextCursor);

  try {
    // check friend
    const friendship = await getFriendshipByUserId(myId, partnerId);
    if (!friendship)
      return res.status(404).json({ message: "no friendship found" });

    // scroll down
    if (!prevCursor && !!nextCursor) {
      const moments = await getMomentsByNextCursorAndUserId(
        nextCursor,
        partnerId,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });

      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        prevEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // scroll up
    } else if (!!prevCursor && !nextCursor) {
      const moments = await getMomentsByPrevCursorAndUserId(
        prevCursor,
        partnerId,
        limit,
      );
      if (moments.length === 0)
        return res.status(404).json({ message: "no moments found" });
      console.log("moments from feed moment", moments);

      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        prevEnd: moments.length === limit ? false : true,
      };
      res.json(response);

      // grid to feed
    } else if (!!prevCursor && !!nextCursor) {
      if (prevCursor !== nextCursor)
        return res
          .status(406)
          .json({ message: "nextCursor and prevCursor not equal" });
      const halfLimit = limit / 2;
      const currentMoment = await getMomentById(prevCursor);
      if (!currentMoment)
        return res.status(404).json({ message: "no moments found" });
      const nextMoment = await getMomentsByNextCursorAndUserId(
        nextCursor,
        partnerId,
        halfLimit,
      );
      if (nextMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });
      const prevMoment = await getMomentsByPrevCursorAndUserId(
        prevCursor,
        partnerId,
        halfLimit - 1,
      );
      if (prevMoment.length === 0)
        return res.status(404).json({ message: "no moments found" });
      const moments = [...prevMoment, currentMoment, ...nextMoment];
      console.log("moments from feed moment", moments);
      const responseMoments = moments.map((moment) => {
        return {
          id: moment.id,
          thumbnail: moment.thumbnail,
        };
      });
      const response = {
        moments: responseMoments,
        prevCursor: moments[0].id,
        nextCursor: moments[moments.length - 1].id,
        prevEnd: prevMoment.length === halfLimit - 1 ? false : true,
        nextEnd: nextMoment.length === halfLimit ? false : true,
      };
      res.json(response);
    } else {
      res.status(404).json({ message: "error from feed moment" });
    }
  } catch (e) {
    console.error("error from feed moment", e);
    res.status(500).json({ message: "error from feed moment" });
  }
};
