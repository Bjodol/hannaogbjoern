import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Form({ _id }) {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let response;
    setFormData(data);
    try {
      response = await fetch("/api/createComment", {
        method: "POST",
        body: JSON.stringify(data),
        type: "application/json",
      });
      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      setFormData(err);
    }
  };

  if (isSubmitting) {
    return <h3>Submitting comment…</h3>;
  }
  if (hasSubmitted) {
    return (
      <>
        <h3>Takk for interessen!</h3>
        <ul>
          <li>
            Navn: {formData.name} <br />
            Email: {formData.email} <br />
            Kommentar: {formData.comment}
          </li>
        </ul>
      </>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg"
      disabled
    >
      <input {...register("_id")} type="hidden" name="_id" value={_id} />
      <label className="block mb-5">
        <span className="text-gray-700">Navn</span>
        <input
          name="name"
          {...register("name", { required: true })}
          className="shadow border rounded py-2 px-3 form-input mt-1 block w-full"
          placeholder="Navnet ditt"
        />
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Email</span>
        <input
          name="email"
          type="email"
          {...register("email", { required: true })}
          className="shadow border rounded py-2 px-3 form-input mt-1 block w-full"
          placeholder="din@epost.sj"
        />
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Kommentar</span>
        <textarea
          {...register("comment", { required: true })}
          name="comment"
          className="shadow border rounded py-2 px-3  form-textarea mt-1 block w-full"
          rows="8"
          placeholder="Hvis du også har får vane og kommentere i kommentarfeltet på VG så holder sikkert det 🤪"
        ></textarea>
      </label>
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
      <input
        type="submit"
        className="shadow bg-pink-700 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      />
    </form>
  );
}
