import { ElMessageBox } from "element-plus";
import service from "../utils/axios";

// General post request
export async function post(url, data) {
  let response = {
    code: "",
    data: "",
    msg: "",
    success: true,
  };

  try {
    const res = await service({
      url: url,
      method: "post",
      data: data || {},
    });

    if (res.data === undefined && res.data !== 0) {
      res.data = {};
    }
    response = res;
  } catch (ex) {
    response.success = false;
    response.msg = ex;
    response.data = {};
  }

  return response;
}

// Delete request with confirmation
export async function postDelete(url, data) {
  try {
    await ElMessageBox.confirm("Are you sure you want to delete?", "Warning", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    });
    return await post(url, data);
  } catch {
    return { success: false, msg: "Operation cancelled" };
  }
}

// Update single field request
export async function postSingleUpdate(getUrl, saveUrl, id, content, obj) {
  try {
    await ElMessageBox.confirm(content, "Warning", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    });

    const { data } = await post(getUrl, { id: id });
    const updatedData = { ...data, ...obj };
    return await post(saveUrl, updatedData);
  } catch {
    return { success: false, msg: "Operation cancelled" };
  }
}

// File upload request
export async function postUpload(url, body) {
  let response = {
    code: "",
    data: "",
    msg: "",
    success: true,
  };

  try {
    const res = await service({
      url: url,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: body || {},
    });
    response = res;
  } catch (ex) {
    response.success = false;
    response.msg = ex;
    response.data = {};
  }

  return response;
}

export default {
  post,
  postDelete,
  postSingleUpdate,
  postUpload,
};
